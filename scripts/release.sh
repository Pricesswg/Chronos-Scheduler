#!/usr/bin/env bash
# Bump version, rebuild, commit, tag, push, create GitHub release.
# Usage: ./scripts/release.sh <version> "<release notes>"
#   e.g. ./scripts/release.sh 1.0.1 "Fix sidebar drawer on iOS"

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <version> \"<release notes>\""
  echo "  e.g. $0 1.0.1 \"Fix sidebar drawer on iOS\""
  exit 1
fi

VERSION="$1"
NOTES="$2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

# Sanity: on main
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "Not on main (currently on $BRANCH). Aborting."
  exit 1
fi

# The script bumps the version and (intentionally) captures every pending
# working-tree change in the same release commit: that was the original
# design and it's fine. No "clean tree" check here — it would be wrong to
# bail out when committing those changes is exactly what we want.

# Sanity: the tag must not exist yet (locally or remotely). Checked BEFORE
# the fetch to avoid downloading data for nothing, and again AFTER the
# fetch to catch tags published by a collaborator while we were working.
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Tag v$VERSION already exists locally."
  exit 1
fi

echo "==> Syncing with the remote"
git fetch origin
if git rev-parse "origin/v$VERSION" >/dev/null 2>&1 || git ls-remote --tags origin "v$VERSION" | grep -q "v$VERSION"; then
  echo "Tag v$VERSION already exists on the remote. Aborting."
  exit 1
fi

# If the remote has new commits (e.g. README/funding edits from the GitHub
# web UI), integrate them before starting the bump. Rebase instead of merge
# to keep history linear. Without this step the script produces a release
# commit it then fails to push, which has to be fixed by hand.
LOCAL_AHEAD="$(git rev-list --count origin/main..main 2>/dev/null || echo 0)"
REMOTE_AHEAD="$(git rev-list --count main..origin/main 2>/dev/null || echo 0)"
if [ "$REMOTE_AHEAD" -gt 0 ]; then
  echo "==> Remote has $REMOTE_AHEAD new commit(s), rebasing"
  # `git pull --rebase` refuses unstaged changes. If there are any — the
  # typical case, since the script commits the working tree right after —
  # stash them, rebase, and restore. Only pop when the stash actually
  # created a commit (i.e. there were changes).
  STASHED=0
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git stash push -u -m "release.sh auto-stash v$VERSION"
    STASHED=1
  fi
  git pull --rebase origin main
  if [ "$STASHED" -eq 1 ]; then
    git stash pop
  fi
fi
if [ "$LOCAL_AHEAD" -gt 0 ]; then
  echo "You have $LOCAL_AHEAD unpushed local commit(s). Push first, then rerun."
  git log --oneline "origin/main..main"
  exit 1
fi

echo "==> Bumping version to $VERSION"

# const.py
sed -i.bak -E "s/^VERSION = \"[^\"]+\"/VERSION = \"$VERSION\"/" \
  custom_components/chronos/const.py
rm custom_components/chronos/const.py.bak

# manifest.json
python3 -c "
import json, sys
p = 'custom_components/chronos/manifest.json'
with open(p) as f: m = json.load(f)
m['version'] = '$VERSION'
with open(p, 'w') as f: json.dump(m, f, indent=2); f.write('\n')
"

# version.ts (shown in the card's sidebar)
sed -i.bak -E "s/^export const CARD_VERSION = \"[^\"]+\";/export const CARD_VERSION = \"$VERSION\";/" \
  chronos-card/src/version.ts
rm chronos-card/src/version.ts.bak

echo "==> Rebuilding card frontend"
(cd chronos-card && npm run build)

# Sync the icon from the repo root to the places HA + HACS look for it:
#  - custom_components/chronos/icon.png       (legacy, used by some tools)
#  - custom_components/chronos/brand/icon.png (HA 2026.3+ Brands Proxy API)
#  - custom_components/chronos/brand/icon@2x.png (hi-DPI variant)
if [ -f icon.png ]; then
  cp icon.png custom_components/chronos/icon.png
  mkdir -p custom_components/chronos/brand
  cp icon.png custom_components/chronos/brand/icon.png
  if command -v sips >/dev/null 2>&1; then
    sips -Z 512 icon.png --out custom_components/chronos/brand/icon@2x.png >/dev/null 2>&1 || true
  fi
  echo "==> Icon synced to custom_components/chronos/{,brand/}"
fi

echo "==> Commit"
git add -A
git commit -m "Release v$VERSION

$NOTES"

echo "==> Tag v$VERSION"
git tag "v$VERSION"

echo "==> Push"
git push origin main
git push origin "v$VERSION"

echo "==> GitHub Release"
gh release create "v$VERSION" --title "v$VERSION" --notes "$NOTES"

echo
echo "Release v$VERSION published."
echo "HACS will pick up the update within a few hours — users will see the badge in HACS."
