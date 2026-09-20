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
if command -v rsync >/dev/null 2>&1; then
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

echo "==> node $(node -v), npm $(npm -v)"
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
echo "==> Installing dependencies"
npm install --no-audit --no-fund --omit=dev
echo "==> Build output shipped from git (.next). Skipping npm run build."

# 4) Passenger restarts the app when this file's timestamp changes.
mkdir -p tmp
touch tmp/restart.txt
echo "==> Done. App restarted."
