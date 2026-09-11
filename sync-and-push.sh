#!/bin/bash
# One-shot updater for this repo. Run it from the repo root every time
# Claude sends a new portfolio-redesign-files*.zip.
#
# Usage:
#   ./sync-and-push.sh ~/Downloads/portfolio-redesign-files-4.zip
#   ./sync-and-push.sh ~/Downloads/portfolio-redesign-files-4.zip "custom commit message"
#
# What it does: extracts the zip, copies the new src/public/config files
# over the current ones, installs any new dependency, runs a production
# build as a sanity check (it will NOT commit or push if the build fails),
# then commits and pushes to whatever branch you currently have checked out.

set -e

ZIP_PATH="$1"
COMMIT_MSG="${2:-Portfolio update $(date '+%Y-%m-%d %H:%M')}"

if [ -z "$ZIP_PATH" ]; then
  echo "Usage: ./sync-and-push.sh /path/to/portfolio-redesign-files.zip [\"commit message\"]"
  exit 1
fi
if [ ! -f "$ZIP_PATH" ]; then
  echo "Can't find that zip: $ZIP_PATH"
  exit 1
fi
if [ ! -f "package.json" ] || [ ! -d "src/app" ]; then
  echo "This doesn't look like the repo root (no package.json / src/app here)."
  echo "cd into your Portfolio folder first, then re-run this script."
  exit 1
fi

WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "==> Extracting $ZIP_PATH"
unzip -q "$ZIP_PATH" -d "$WORKDIR"

echo "==> Copying files into place"
cp -r "$WORKDIR/src" ./
cp -r "$WORKDIR/public" ./
for f in package.json next.config.js tailwind.config.js postcss.config.js tsconfig.json next-env.d.ts package-lock.json sync-and-push.sh; do
  if [ -f "$WORKDIR/$f" ]; then
    cp "$WORKDIR/$f" ./
  fi
done

echo "==> Installing dependencies"
npm install

echo "==> Sanity-checking the build (will not push if this fails)"
npm run build

echo "==> Committing and pushing"
git add -A
if git diff --cached --quiet; then
  echo "Nothing changed, nothing to commit."
  exit 0
fi
git commit -m "$COMMIT_MSG"
git push

echo "==> Done. Vercel should pick this up and redeploy automatically."
