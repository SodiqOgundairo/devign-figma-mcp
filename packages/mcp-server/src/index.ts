#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createDevignServer } from "./server.js";

const WS_PORT = parseInt(process.env.DEVIGN_WS_PORT ?? "3055", 10);
const WS_TIMEOUT = parseInt(process.env.DEVIGN_WS_TIMEOUT ?? "15000", 10);

async function main() {
  const { server, bridge } = createDevignServer({
    wsPort: WS_PORT,
    wsTimeout: WS_TIMEOUT,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(`[devign-mcp] MCP server running (WS port: ${WS_PORT})`);

  process.on("SIGINT", () => {
    bridge.close();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    bridge.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("[devign-mcp] Fatal error:", err);
  process.exit(1);
});
