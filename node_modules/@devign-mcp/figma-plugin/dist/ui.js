"use strict";
(() => {
  // src/ui.ts
  var WS_URL = "ws://127.0.0.1:3055";
  var RECONNECT_BASE_MS = 1e3;
  var RECONNECT_MAX_MS = 1e4;
  var ws = null;
  var reconnectDelay = RECONNECT_BASE_MS;
  var reconnectTimer = null;
  var dot = document.getElementById("dot");
  var statusEl = document.getElementById("status");
  var logEl = document.getElementById("log");
  function log(msg) {
    const line = document.createElement("div");
    line.textContent = `${(/* @__PURE__ */ new Date()).toLocaleTimeString()} ${msg}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
    while (logEl.children.length > 50) {
      logEl.removeChild(logEl.firstChild);
    }
  }
  function setConnected(connected) {
    dot.classList.toggle("connected", connected);
    statusEl.textContent = connected ? "Connected" : "Disconnected";
  }
  function connect() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
      return;
    }
    try {
      ws = new WebSocket(WS_URL);
    } catch (e) {
      log("Failed to create WebSocket");
      scheduleReconnect();
      return;
    }
    ws.onopen = () => {
      setConnected(true);
      reconnectDelay = RECONNECT_BASE_MS;
      log("Connected to MCP server");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        parent.postMessage({ pluginMessage: data }, "*");
      } catch (e) {
        log("Bad message from server");
      }
    };
    ws.onclose = () => {
      setConnected(false);
      ws = null;
      log("Disconnected");
      scheduleReconnect();
    };
    ws.onerror = () => {
    };
  }
  function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      reconnectDelay = Math.min(reconnectDelay * 1.5, RECONNECT_MAX_MS);
      connect();
    }, reconnectDelay);
  }
  onmessage = (event) => {
    var _a;
    const msg = (_a = event.data) == null ? void 0 : _a.pluginMessage;
    if (!msg) return;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    } else {
      log("Cannot send: not connected");
    }
  };
  connect();
})();
