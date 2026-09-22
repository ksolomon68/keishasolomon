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

# 1) Sync tracked source. Server-only state (secrets, uploads, deps, build output) is never touched.
#    Two-pass strategy to eliminate ChunkLoadError on rolling Passenger restarts:
#      Pass A – sync everything EXCEPT .next/static with --delete (removes stale server files safely).
#      Pass B – sync .next/static WITHOUT --delete (only adds/updates hashed assets; old ones remain
#               available to any in-flight worker still serving the previous build's HTML).
#    Old static files accumulate but are small; prune manually if disk space is a concern.
if command -v rsync >/dev/null 2>&1; then
  # Pass A: all source files (safe to delete stale ones)
  rsync -a --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.env.local' --exclude='.env.production' --exclude='.env.production.local' \
    --exclude='storage' \
    --exclude='.data' \
    --exclude='tmp' \
    --exclude='.htaccess' \
    "$REPO_DIR"/ "$APP_DIR"/

  # Pass B: .next server/config files (safe to delete – server only reads them after restart)
  rsync -a --delete \
    --exclude='.next/static' \
    --exclude='.next/cache' \
    "$REPO_DIR"/.next/ "$APP_DIR"/.next/

  # Pass C: .next/static hashed assets – additive only, never delete
  rsync -a \
    "$REPO_DIR"/.next/static/ "$APP_DIR"/.next/static/
else
  echo "(rsync not found; falling back to git archive, removed files will not be deleted)"
  git -C "$REPO_DIR" archive HEAD | tar -x -C "$APP_DIR"
fi

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

# 4) Passenger restarts the app when this file's timestamp changes.
mkdir -p tmp
touch tmp/restart.txt
echo "==> Done. App restarted."
