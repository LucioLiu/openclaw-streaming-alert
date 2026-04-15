# OpenClaw Streaming Alert

> 🔔 OpenClaw Web UI 提示音增强：回复完成时响叮叮，卡死时响警报，不用一直盯着屏幕。

## 功能

| 事件 | 声音 | 说明 |
|------|------|------|
| 回复完成 | 叮叮（两声清脆高音） | AI 回复结束后立即提示 |
| 可能卡死 | 嘟嘟嘟（三声低音） | 60 秒无新内容 |
| 肯定卡死 | 再次嘟嘟嘟 | 180 秒仍无新内容 |

## 为什么需要这个？

OpenClaw 在执行长任务时偶尔会卡死沉默，刷新也不行，消息被吞。有了提示音：

- ✅ 完成时知道可以回来了
- ✅ 卡死时知道需要介入处理
- ✅ 不用每分钟刷一次网页

## 浏览器兼容性

Chrome · Edge · Firefox · Safari · Opera 全部支持，基于 Web 标准 API（Web Audio API + MutationObserver）。

## 安装

### 一键安装（推荐）

```bash
curl -sSL https://raw.githubusercontent.com/LucioLiu/openclaw-streaming-alert/main/install.sh | bash
```

### 手动安装

1. 下载 `openclaw-streaming-alert.js`
2. 编辑 OpenClaw 的 `dist/control-ui/index.html`
3. 在 `</body>` 前添加：

```html
<script src="./js/openclaw-streaming-alert.js"></script>
```

4. 把 `openclaw-streaming-alert.js` 放到 `dist/control-ui/js/` 目录下
5. 刷新 OpenClaw 网页

## 自定义

编辑 `openclaw-streaming-alert.js` 顶部的配置：

```javascript
var VOLUME = 0.4;          // 音量 0.0 ~ 1.0
var STALL_TIMEOUT = 60;    // 卡死判定秒数
var STALL_HARD_TIMEOUT = 180;  // 严重卡死秒数
```

## 卸载

从 `index.html` 中删除 `<script src="./js/openclaw-streaming-alert.js"></script>` 这一行，并删除 `js/openclaw-streaming-alert.js` 文件。

## 注意事项

- OpenClaw 更新后需要重新安装（会覆盖 `dist/` 目录）
- 首次使用需要点击一下页面（浏览器音频策略要求用户先交互）

## License

MIT
