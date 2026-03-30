import type { WsBridge } from "../ws-bridge.js";

export function ensureConnected(bridge: WsBridge): void {
  if (!bridge.isConnected()) {
    throw new Error("Figma plugin not connected. Open the Devign MCP Bridge plugin in Figma.");
  }
}

export function toolResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function toolError(message: string) {
  return {
    content: [{ type: "text" as const, text: `Error: ${message}` }],
    isError: true,
  };
}
