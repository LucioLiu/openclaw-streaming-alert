(function () {
  'use strict';

  var VOLUME = 0.4;
  var STALL_TIMEOUT = 60;
  var STALL_HARD_TIMEOUT = 180;
  var POLL_INTERVAL = 3000;
  var CONTENT_CHECK_INTERVAL = 5000;

  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playComplete() {
    try {
      var ctx = getAudioCtx();
      var now = ctx.currentTime;
      var o1 = ctx.createOscillator();
      var g1 = ctx.createGain();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(880, now);
      g1.gain.setValueAtTime(VOLUME, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      o1.connect(g1); g1.connect(ctx.destination);
      o1.start(now); o1.stop(now + 0.15);
      var o2 = ctx.createOscillator();
      var g2 = ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(1320, now + 0.18);
      g2.gain.setValueAtTime(0.001, now);
      g2.gain.setValueAtTime(VOLUME, now + 0.18);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      o2.connect(g2); g2.connect(ctx.destination);
      o2.start(now + 0.18); o2.stop(now + 0.38);
    } catch (e) { console.log('[streaming-alert] play error:', e); }
  }

  function playStall() {
    try {
      var ctx = getAudioCtx();
      var now = ctx.currentTime;
      for (var i = 0; i < 3; i++) {
        var off = i * 0.35;
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = 'square';
        o.frequency.setValueAtTime(440, now + off);
        g.gain.setValueAtTime(0.001, now);
        g.gain.setValueAtTime(VOLUME * 0.5, now + off);
        g.gain.exponentialRampToValueAtTime(0.001, now + off + 0.2);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + off); o.stop(now + off + 0.2);
      }
    } catch (e) { console.log('[streaming-alert] play error:', e); }
  }

  function findStreaming() {
    var app = document.querySelector('openclaw-app');
    var root = app && app.shadowRoot ? app.shadowRoot : document;
    return root.querySelectorAll('.chat-bubble.streaming');
  }

  var wasStreaming = false;
  var lastLen = 0;
  var lastChange = 0;
  var warned = false;
  var hardWarned = false;
  var contentTimer = null;

  function detect() {
    var bubbles = findStreaming();
    var streaming = bubbles.length > 0;

    if (streaming && !wasStreaming) {
      console.log('[streaming-alert] stream started');
      lastLen = 0;
      lastChange = Date.now();
      warned = false;
      hardWarned = false;
      if (contentTimer) clearInterval(contentTimer);
      contentTimer = setInterval(checkContent, CONTENT_CHECK_INTERVAL);
    }

    if (!streaming && wasStreaming) {
      console.log('[streaming-alert] stream ended');
      if (contentTimer) { clearInterval(contentTimer); contentTimer = null; }
      playComplete();
      warned = false;
      hardWarned = false;
    }

    wasStreaming = streaming;
  }

  function checkContent() {
    if (!wasStreaming) return;
    var bubbles = findStreaming();
    var len = 0;
    bubbles.forEach(function (b) { len += b.textContent.length; });
    var now = Date.now();
    if (len !== lastLen) {
      lastLen = len;
      lastChange = now;
      warned = false;
      hardWarned = false;
      return;
    }
    var sec = (now - lastChange) / 1000;
    if (sec >= STALL_HARD_TIMEOUT && !hardWarned) {
      console.log('[streaming-alert] STALL: ' + Math.round(sec) + 's without new content');
      playStall();
      hardWarned = true;
    } else if (sec >= STALL_TIMEOUT && !warned) {
      console.log('[streaming-alert] possible stall: ' + STALL_TIMEOUT + 's without new content');
      playStall();
      warned = true;
    }
  }

  function bindObserver() {
    var app = document.querySelector('openclaw-app');
    var root = app && app.shadowRoot ? app.shadowRoot : document;
    try {
      var obs = new MutationObserver(function () { detect(); });
      obs.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    } catch (e) { /* shadow DOM not ready yet, poll will retry */ }
  }

  setTimeout(function () {
    bindObserver();
    setInterval(function () { detect(); bindObserver(); }, POLL_INTERVAL);
    console.log('[streaming-alert] ready | complete=ding | stall=' + STALL_TIMEOUT + 's=buzz');
  }, POLL_INTERVAL);
})();
