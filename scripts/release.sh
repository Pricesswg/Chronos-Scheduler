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

# Lo script bumpa version + (intenzionalmente) cattura tutte le modifiche
# pending del working tree nello stesso commit di release: era il design
# originale e va bene così. Niente check di "tree pulito" qui — sarebbe
# sbagliato bloccarsi quando in realtà vogliamo proprio committare quelle
# modifiche.

# Sanity: tag non esiste già (né locale né remoto). Lo controllo PRIMA del
# fetch così evitiamo di scaricare dati per nulla, e di nuovo DOPO il fetch
# per intercettare tag pubblicati dal collaboratore mentre stavamo lavorando.
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Tag v$VERSION esiste già localmente."
  exit 1
fi

echo "==> Sincronizzo con il remote"
git fetch origin
if git rev-parse "origin/v$VERSION" >/dev/null 2>&1 || git ls-remote --tags origin "v$VERSION" | grep -q "v$VERSION"; then
  echo "Tag v$VERSION esiste già sul remote. Aborto."
  exit 1
fi

# Se il remote ha commit nuovi (es. README/funding edits dal browser GitHub),
# li integriamo prima di partire con il bump. Rebase invece di merge per
# tenere la storia lineare. Senza questo step lo script genera un commit di
# release che poi non riesce a pushare e va sistemato a mano.
LOCAL_AHEAD="$(git rev-list --count origin/main..main 2>/dev/null || echo 0)"
REMOTE_AHEAD="$(git rev-list --count main..origin/main 2>/dev/null || echo 0)"
if [ "$REMOTE_AHEAD" -gt 0 ]; then
  echo "==> Remote ha $REMOTE_AHEAD commit nuovi, rebase in corso"
  # `git pull --rebase` rifiuta unstaged changes. Se ce ne sono — è il caso
  # tipico, dato che lo script committa il working tree subito dopo — le
  # stashiamo, rebasiamo, e ripristiniamo. Solo se lo stash crea davvero
  # un commit (cioè c'erano modifiche).
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
  echo "Hai $LOCAL_AHEAD commit locali non pushati. Pusha prima, poi rilancia."
  git log --oneline "origin/main..main"
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
