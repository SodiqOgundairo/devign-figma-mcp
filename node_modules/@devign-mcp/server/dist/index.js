#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { createDevignServer } from "./server.js";
const WS_PORT = parseInt(process.env.DEVIGN_WS_PORT ?? "3055", 10);
const WS_TIMEOUT = parseInt(process.env.DEVIGN_WS_TIMEOUT ?? "15000", 10);
const TRANSPORT = process.env.DEVIGN_TRANSPORT ?? "stdio"; // "stdio" | "http"
const HTTP_PORT = parseInt(process.env.DEVIGN_HTTP_PORT ?? "3100", 10);
async function main() {
    const { server, bridge } = createDevignServer({
        wsPort: WS_PORT,
        wsTimeout: WS_TIMEOUT,
    });
    if (TRANSPORT === "http") {
        await startHttpTransport(server, bridge);
    }
    else {
        await startStdioTransport(server, bridge);
    }
}
async function startStdioTransport(server, bridge) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[devign-mcp] MCP server running via stdio (WS port: ${WS_PORT})`);
    process.on("SIGINT", () => {
        bridge.close();
        process.exit(0);
    });
    process.on("SIGTERM", () => {
        bridge.close();
        process.exit(0);
    });
}
async function startHttpTransport(server, bridge) {
    const app = express();
    app.use(express.json());
    // Streamable HTTP transport: single /mcp endpoint for POST + GET (SSE)
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless mode
    });
    await server.connect(transport);
    // All MCP messages go through /mcp
    app.post("/mcp", async (req, res) => {
        await transport.handleRequest(req, res);
    });
    // SSE stream for server-initiated messages (optional)
    app.get("/mcp", async (req, res) => {
        await transport.handleRequest(req, res);
    });
    // DELETE for session cleanup
    app.delete("/mcp", async (req, res) => {
        await transport.handleRequest(req, res);
    });
    // Health check
    app.get("/health", (_req, res) => {
        res.json({
            status: "ok",
            transport: "streamable-http",
            pluginConnected: bridge.isConnected(),
            version: "2.0.0",
        });
    });
    app.listen(HTTP_PORT, () => {
        console.error(`[devign-mcp] MCP server running via Streamable HTTP on http://127.0.0.1:${HTTP_PORT} (WS port: ${WS_PORT})`);
        console.error(`[devign-mcp] MCP endpoint: POST/GET http://127.0.0.1:${HTTP_PORT}/mcp`);
        console.error(`[devign-mcp] Health check: http://127.0.0.1:${HTTP_PORT}/health`);
    });
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
//# sourceMappingURL=index.js.map