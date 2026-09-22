#!/bin/bash
# cPanel "Git Version Control" deployment (run via .cpanel.yml).
# Copies the repo into the Node.js app directory, installs dependencies, builds, and restarts the app.
#
# One-time setup in cPanel (see README "Deploying"):
#   1. Setup Node.js App: Node >= 20.9, Application root = $APP_NAME, startup file = server.js
#   2. Create $HOME/$APP_NAME/.env.local with the production values (DATA_BACKEND=mysql, DB_*, SESSION_SECRET, ...)
#
# Override the app directory name by exporting APP_NAME before running (default below).
set -euo pipefail

# cPanel's deploy runner can start with a minimal environment (no HOME), so resolve it explicitly.
HOME="${HOME:-$(getent passwd "$(id -u)" | cut -d: -f6)}"
export HOME

echo "==== $(date -u +%FT%TZ) deploy started (user $(id -un), HOME=$HOME) ===="

APP_NAME="${APP_NAME:-sandbox-app}"
APP_DIR="$HOME/$APP_NAME"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Deploying $REPO_DIR -> $APP_DIR"
mkdir -p "$APP_DIR"

# 1) Sync tracked source. Server-only state (secrets, uploads and dependencies) is never touched.
#    Never update .next in place: its manifests, server files and browser chunks are one release and
#    mixing files from two builds causes ChunkLoadError / blank-page failures during a deploy.
command -v rsync >/dev/null 2>&1 || {
  echo "ERROR: rsync is required for atomic deployment." >&2
  exit 1
}
# Source files are not read by the production server; compiled output is switched separately below.
rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.next-releases' \
  --exclude='.env.local' --exclude='.env.production' --exclude='.env.production.local' \
  --exclude='storage' \
  --exclude='.data' \
  --exclude='tmp' \
  --exclude='.htaccess' \
  "$REPO_DIR"/ "$APP_DIR"/

cd "$APP_DIR"

# 2) Use the Node version selected for this app in cPanel, if a virtualenv exists.
ACTIVATE="$(ls -d "$HOME/nodevenv/$APP_NAME"/*/bin/activate 2>/dev/null | sort -V | tail -n1 || true)"
if [ -n "$ACTIVATE" ]; then
  echo "==> Activating $ACTIVATE"
  set +u
  # shellcheck disable=SC1090
  source "$ACTIVATE"
  set -u
else
  echo "(no cPanel Node virtualenv found for $APP_NAME; using node from PATH)"
fi

# npm can crash on some shared hosts (see step 3), so never let a version probe abort the deploy.
echo "==> node $(node -v), npm $(npm -v 2>/dev/null || echo 'unavailable')"
node -e 'const [a,b]=process.versions.node.split(".").map(Number); process.exit(a>20||(a===20&&b>=9)?0:1)' || {
  echo "ERROR: Node >= 20.9 is required. Select it under cPanel > Setup Node.js App." >&2
  exit 1
}

if [ ! -f .env.local ]; then
  echo "ERROR: $APP_DIR/.env.local is missing. Create it with the production settings (see .env.example)." >&2
  exit 1
fi

# 3) Install (devDependencies are needed for the build) and build. Shared hosts have tight memory limits.
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"
export NEXT_CPU_COUNT=1

# npm aborts (core dump) on this shared host under its process/memory limits, and most deploys don't change
# dependencies anyway. So only run `npm install` when package.json or the lockfile actually changed, and
# remember what was installed in a stamp file. node_modules is never touched by the sync above.
# One-time bootstrap when node_modules is known-good but has no stamp yet:
#   SKIP_NPM_INSTALL=1 bash scripts/cpanel-deploy.sh
DEPS_STAMP="node_modules/.deps-hash"
DEPS_HASH="$(cat package.json package-lock.json 2>/dev/null | sha256sum | cut -d' ' -f1)"
if [ "${SKIP_NPM_INSTALL:-}" = "1" ]; then
  [ -d node_modules ] || { echo "ERROR: SKIP_NPM_INSTALL=1 but node_modules is missing." >&2; exit 1; }
  echo "==> SKIP_NPM_INSTALL=1: keeping the existing node_modules."
  echo "$DEPS_HASH" > "$DEPS_STAMP"
elif [ -d node_modules ] && [ -f "$DEPS_STAMP" ] && [ "$(cat "$DEPS_STAMP")" = "$DEPS_HASH" ]; then
  echo "==> Dependencies unchanged; skipping npm install."
else
  echo "==> Installing dependencies"
  npm install --no-audit --no-fund --omit=dev
  echo "$DEPS_HASH" > "$DEPS_STAMP"
fi
echo "==> Build output shipped from git (.next). Skipping npm run build."

# 4) Assemble and validate the entire Next.js release before making it live.
#    Previous static chunks are carried forward so open browser tabs can finish loading the old build.
[ -f "$REPO_DIR/.next/BUILD_ID" ] || { echo "ERROR: committed .next/BUILD_ID is missing." >&2; exit 1; }
BUILD_ID="$(tr -d '\r\n' < "$REPO_DIR/.next/BUILD_ID")"
[ -n "$BUILD_ID" ] || { echo "ERROR: committed .next/BUILD_ID is empty." >&2; exit 1; }
case "$BUILD_ID" in
  *[!A-Za-z0-9_-]*) echo "ERROR: committed .next/BUILD_ID contains unsafe characters." >&2; exit 1 ;;
esac
[ -f "$REPO_DIR/.next/required-server-files.json" ] || {
  echo "ERROR: committed .next build is incomplete (required-server-files.json missing)." >&2
  exit 1
}
[ -d "$REPO_DIR/.next/static" ] || { echo "ERROR: committed .next/static is missing." >&2; exit 1; }

RELEASES_DIR="$APP_DIR/.next-releases"
RELEASE_NAME="$BUILD_ID-$(date -u +%Y%m%dT%H%M%SZ)-$$"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_NAME"
RELEASE_TMP="$RELEASES_DIR/.staging-$RELEASE_NAME"
mkdir -p "$RELEASES_DIR"
rm -rf "$RELEASE_TMP"
mkdir -p "$RELEASE_TMP"

rsync -a --delete --exclude='cache' "$REPO_DIR/.next/" "$RELEASE_TMP/"
# Preserve immutable, hashed assets from earlier deployments without replacing files from the new build.
if [ -d "$APP_DIR/.next/static" ]; then
  rsync -a --ignore-existing "$APP_DIR/.next/static/" "$RELEASE_TMP/static/"
fi

[ "$(tr -d '\r\n' < "$RELEASE_TMP/BUILD_ID")" = "$BUILD_ID" ] || {
  echo "ERROR: staged build ID does not match $BUILD_ID." >&2
  exit 1
}
[ -f "$RELEASE_TMP/server/pages-manifest.json" ] || {
  echo "ERROR: staged Next.js server manifest is missing." >&2
  exit 1
}

# Publish the staged directory, then atomically replace the .next symlink. The first deployment
# migrates the legacy real .next directory out of the way; later deployments are a single rename.
mv "$RELEASE_TMP" "$RELEASE_DIR"
if [ -e "$APP_DIR/.next" ] && [ ! -L "$APP_DIR/.next" ]; then
  LEGACY_DIR="$RELEASES_DIR/legacy-$(date -u +%Y%m%dT%H%M%SZ)"
  mv "$APP_DIR/.next" "$LEGACY_DIR"
fi
NEXT_LINK="$APP_DIR/.next.new-$$"
ln -s ".next-releases/$RELEASE_NAME" "$NEXT_LINK"
mv -Tf "$NEXT_LINK" "$APP_DIR/.next"
echo "==> Activated Next.js build $BUILD_ID"

# 5) Passenger restarts the app when this file's timestamp changes.
mkdir -p tmp
touch tmp/restart.txt
echo "==> Done. App restarted."
