import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import type { BridgeRequest, BridgeResponse } from "./types.js";
import type { CommandType } from "./types.js";

interface PendingRequest {
  resolve: (data: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

export interface WsBridge {
  send(command: CommandType, params: Record<string, unknown>): Promise<unknown>;
  isConnected(): boolean;
  close(): void;
}

export function createWsBridge(options: { port: number; timeout?: number }): WsBridge {
  const { port, timeout = 15_000 } = options;
  const pending = new Map<string, PendingRequest>();
  let client: WebSocket | null = null;

  const wss = new WebSocketServer({ host: "127.0.0.1", port });

  wss.on("connection", (ws) => {
    if (client) {
      // Replace old connection
      client.close();
    }
    client = ws;
    console.error(`[devign-mcp] Figma plugin connected`);

    ws.on("message", (raw) => {
      try {
        const response: BridgeResponse = JSON.parse(raw.toString());
        const entry = pending.get(response.id);
        if (!entry) return;

        clearTimeout(entry.timer);
        pending.delete(response.id);

        if (response.success) {
          entry.resolve(response.data);
        } else {
          entry.reject(new Error(response.error ?? "Unknown plugin error"));
        }
      } catch {
        // Ignore malformed messages
      }
    });

    ws.on("close", () => {
      if (client === ws) {
        client = null;
        console.error(`[devign-mcp] Figma plugin disconnected`);
      }
    });
  });

  console.error(`[devign-mcp] WebSocket server listening on ws://127.0.0.1:${port}`);

  return {
    send(command: CommandType, params: Record<string, unknown>): Promise<unknown> {
      if (!client || client.readyState !== WebSocket.OPEN) {
        return Promise.reject(
          new Error("Figma plugin not connected. Open the Devign MCP Bridge plugin in Figma.")
        );
      }

      const id = randomUUID();
      const request: BridgeRequest = { id, command, params };

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Timeout: Figma plugin did not respond within ${timeout}ms`));
        }, timeout);

        pending.set(id, { resolve, reject, timer });
        client!.send(JSON.stringify(request));
      });
    },

    isConnected(): boolean {
      return client !== null && client.readyState === WebSocket.OPEN;
    },

    close() {
      for (const [id, entry] of pending) {
        clearTimeout(entry.timer);
        entry.reject(new Error("Bridge shutting down"));
      }
      pending.clear();
      wss.close();
    },
  };
}
