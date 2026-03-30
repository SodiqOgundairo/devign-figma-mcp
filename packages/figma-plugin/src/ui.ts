// UI thread — runs in an iframe with browser APIs (including WebSocket)
// Relays messages between the WebSocket and the plugin main thread

const WS_URL = "ws://127.0.0.1:3055";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 10000;

let ws: WebSocket | null = null;
let reconnectDelay = RECONNECT_BASE_MS;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

const dot = document.getElementById("dot")!;
const statusEl = document.getElementById("status")!;
const logEl = document.getElementById("log")!;

function log(msg: string) {
  const line = document.createElement("div");
  line.textContent = `${new Date().toLocaleTimeString()} ${msg}`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
  // Keep last 50 lines
  while (logEl.children.length > 50) {
    logEl.removeChild(logEl.firstChild!);
  }
}

function setConnected(connected: boolean) {
  dot.classList.toggle("connected", connected);
  statusEl.textContent = connected ? "Connected" : "Disconnected";
}

function connect() {
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
    return;
  }

  try {
    ws = new WebSocket(WS_URL);
  } catch {
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
      const data = JSON.parse(event.data as string);
      // Forward to plugin main thread
      parent.postMessage({ pluginMessage: data }, "*");
    } catch {
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
    // onclose will fire after this
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

// Messages from plugin main thread -> send to WebSocket
onmessage = (event) => {
  const msg = event.data?.pluginMessage;
  if (!msg) return;

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  } else {
    log("Cannot send: not connected");
  }
};

// Start connection
connect();
