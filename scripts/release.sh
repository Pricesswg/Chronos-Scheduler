#!/usr/bin/env bash
# Bump version, rebuild, commit, tag, push, create GitHub release.
# Usage: ./scripts/release.sh <version> "<release notes>"
#   es:  ./scripts/release.sh 1.0.1 "Fix sidebar drawer su iOS"

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <version> \"<release notes>\""
  echo "  es:  $0 1.0.1 \"Fix sidebar drawer su iOS\""
  exit 1
fi

VERSION="$1"
NOTES="$2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

# Sanity: on main
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "$BRANCH" != "main" ]; then
  echo "Non sei su main (sei su $BRANCH). Aborto."
  exit 1
fi

# Sanity: tag non esiste già
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Tag v$VERSION esiste già."
  exit 1
fi

echo "==> Bump versione a $VERSION"

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

# version.ts (visualizzato nella sidebar della card)
sed -i.bak -E "s/^export const CARD_VERSION = \"[^\"]+\";/export const CARD_VERSION = \"$VERSION\";/" \
  chronos-card/src/version.ts
rm chronos-card/src/version.ts.bak

echo "==> Rebuild card frontend"
(cd chronos-card && npm run build)

# Sincronizza l'icona dal repo root verso le posizioni dove HA + HACS la cercano:
#  - custom_components/chronos/icon.png       (legacy, usata da alcuni tools)
#  - custom_components/chronos/brand/icon.png (HA 2026.3+ Brands Proxy API)
#  - custom_components/chronos/brand/icon@2x.png (versione hi-DPI)
if [ -f icon.png ]; then
  cp icon.png custom_components/chronos/icon.png
  mkdir -p custom_components/chronos/brand
  cp icon.png custom_components/chronos/brand/icon.png
  if command -v sips >/dev/null 2>&1; then
    sips -Z 512 icon.png --out custom_components/chronos/brand/icon@2x.png >/dev/null 2>&1 || true
  fi
  echo "==> Icon sincronizzata in custom_components/chronos/{,brand/}"
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
echo "Release v$VERSION pubblicata."
echo "HACS rileverà l'update entro qualche ora — gli utenti vedranno il badge in HACS."
