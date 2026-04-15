#!/usr/bin/env bash
set -euo pipefail

OPENCLAW_DIR=""
CONTROL_UI=""

for candidate in \
  "$HOME/openclaw/dist/control-ui" \
  "$HOME/.openclaw/dist/control-ui" \
  "$(which openclaw 2>/dev/null | xargs dirname 2>/dev/null)/../lib/node_modules/openclaw/dist/control-ui"; do
  if [ -d "$candidate" ] && [ -f "$candidate/index.html" ]; then
    CONTROL_UI="$candidate"
    break
  fi
done

if [ -z "$CONTROL_UI" ]; then
  echo "Error: Cannot find OpenClaw control-ui directory."
  echo "Please run: INSTALL_DIR=/path/to/openclaw/dist/control-ui $0"
  exit 1
fi

echo "Found OpenClaw at: $CONTROL_UI"

SCRIPT_URL="https://raw.githubusercontent.com/LucioLiu/openclaw-streaming-alert/main/openclaw-streaming-alert.js"
JS_DIR="$CONTROL_UI/js"
DEST="$JS_DIR/openclaw-streaming-alert.js"

mkdir -p "$JS_DIR"

if command -v curl &>/dev/null; then
  curl -sSL "$SCRIPT_URL" -o "$DEST"
elif command -v wget &>/dev/null; then
  wget -q "$SCRIPT_URL" -O "$DEST"
else
  echo "Error: curl or wget required"
  exit 1
fi

if ! grep -q "openclaw-streaming-alert.js" "$CONTROL_UI/index.html"; then
  sed -i 's|</body>|  <script src="./js/openclaw-streaming-alert.js"></script>\n</body>|' "$CONTROL_UI/index.html"
  echo "Script tag added to index.html"
fi

echo ""
echo "Done! Refresh your OpenClaw web UI to hear alerts."
echo "Config: VOLUME=0.4, STALL_TIMEOUT=60s, STALL_HARD_TIMEOUT=180s"
echo "Edit $DEST to customize."
