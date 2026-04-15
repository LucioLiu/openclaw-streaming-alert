# 🔔 OpenClaw Streaming Alert

Sound notification enhancement for [OpenClaw](https://github.com/openclaw/openclaw) Web UI — plays a chime when AI finishes responding, and alerts you if the stream stalls.

> **Inspiration**: This project was born because [OpenCode](https://github.com/opencode-ai/opencode) has a satisfying click sound when it finishes responding. I wanted the same experience in OpenClaw — plus stall detection, since OpenClaw sometimes freezes mid-task without any indication.

[![GitHub](https://img.shields.io/badge/GitHub-LucioLiu%2Fopenclaw--streaming--alert-blue)](https://github.com/LucioLiu/openclaw-streaming-alert)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

| Event | Sound | Description |
|-------|-------|-------------|
| ✅ Stream complete | Ding-ding (two crisp tones) | AI finished responding |
| ⚠️ Possible stall | Buzz-buzz-buzz (three low tones) | 60s with no new content |
| 🚨 Hard stall | Buzz-buzz-buzz again | 180s still no new content |

## Why?

When running long tasks in OpenClaw, the stream sometimes stalls silently — the page appears active but nothing happens, and even refreshing doesn't help. This means:

- You stare at the screen for minutes wondering if it's still working
- You're afraid to touch anything in case you lose progress
- You waste time waiting instead of doing other things

With this script:
- 🔔 Know immediately when a response is complete
- ⚠️ Get alerted when something goes wrong
- 🖥️ Step away from your desk with confidence

## Browser Compatibility

Chrome · Edge · Firefox · Safari · Opera — all modern browsers supported.

Built on Web Audio API and MutationObserver (no external dependencies).

## Install

### One-line install (recommended)

```bash
curl -sSL https://raw.githubusercontent.com/LucioLiu/openclaw-streaming-alert/main/install.sh | bash
```

### Manual install

1. Download [`openclaw-streaming-alert.js`](https://raw.githubusercontent.com/LucioLiu/openclaw-streaming-alert/main/openclaw-streaming-alert.js)
2. Place it in your OpenClaw `dist/control-ui/js/` directory
3. Edit `dist/control-ui/index.html`, add before `</body>`:

```html
<script src="./js/openclaw-streaming-alert.js"></script>
```

4. Refresh your OpenClaw web UI

## Configuration

Edit the top of `openclaw-streaming-alert.js`:

```javascript
var VOLUME = 0.4;              // Volume 0.0 ~ 1.0
var STALL_TIMEOUT = 60;        // Seconds before stall warning
var STALL_HARD_TIMEOUT = 180;  // Seconds before hard stall warning
```

## Uninstall

Remove the `<script>` tag from `index.html` and delete `openclaw-streaming-alert.js`.

## Notes

- Re-install after OpenClaw updates (overwrites `dist/` directory)
- First sound requires a page click (browser autoplay policy)

## Topics

`openclaw` `ai-agent` `notification` `sound-alert` `web-ui` `stall-detection` `streaming`

## License

MIT
