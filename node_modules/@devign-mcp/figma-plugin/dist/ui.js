"use strict";
(() => {
  // src/ui.ts
  var params = new URLSearchParams(window.location.search);
  var _a;
  var WS_URL = `ws://127.0.0.1:${(_a = params.get("port")) != null ? _a : "3055"}`;
  var RECONNECT_BASE_MS = 1e3;
  var RECONNECT_MAX_MS = 1e4;
  var ws = null;
  var reconnectDelay = RECONNECT_BASE_MS;
  var reconnectTimer = null;
  var messageCount = 0;
  var dot = document.getElementById("dot");
  var statusEl = document.getElementById("status");
  var statusHint = document.getElementById("status-hint");
  var logEl = document.getElementById("log");
  var counterEl = document.getElementById("counter");
  function log(msg) {
    const line = document.createElement("div");
    line.textContent = `${(/* @__PURE__ */ new Date()).toLocaleTimeString()} ${msg}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
    while (logEl.children.length > 80) {
      logEl.removeChild(logEl.firstChild);
    }
  }
  function setConnected(connected) {
    dot.classList.toggle("connected", connected);
    statusEl.textContent = connected ? "Connected" : "Disconnected";
    statusHint.textContent = connected ? "AI tools can now read and write to this file." : "Waiting for MCP server... Make sure it is running.";
    statusHint.className = `hint ${connected ? "ok" : "warn"}`;
  }
  function updateCounter() {
    counterEl.textContent = `${messageCount} command${messageCount === 1 ? "" : "s"} processed`;
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
      var _a2;
      try {
        const data = JSON.parse(event.data);
        log(`\u2190 ${(_a2 = data.command) != null ? _a2 : "response"}`);
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
    var _a2;
    const msg = (_a2 = event.data) == null ? void 0 : _a2.pluginMessage;
    if (!msg) return;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
      messageCount++;
      updateCounter();
      log(`\u2192 ${msg.data ? "result" : "response"}`);
    } else {
      log("Cannot send: not connected");
    }
  };
  connect();
})();
