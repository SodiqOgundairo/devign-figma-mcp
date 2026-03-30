import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createWsBridge } from "./ws-bridge.js";
import { registerAllTools } from "./tools/index.js";
import { CommandType } from "./types.js";
export function createDevignServer(config) {
    const server = new McpServer({
        name: "devign-mcp",
        version: "1.0.0",
    });
    const bridge = createWsBridge({
        port: config.wsPort,
        timeout: config.wsTimeout,
    });
    // Register system tools
    server.tool("ping", "Check if the Figma plugin is connected and responsive", {}, async () => {
        if (!bridge.isConnected()) {
            return {
                content: [{ type: "text", text: "Figma plugin is NOT connected. Please open the Devign MCP Bridge plugin in Figma." }],
            };
        }
        try {
            const data = await bridge.send(CommandType.PING, {});
            return {
                content: [{ type: "text", text: `Figma plugin connected. ${JSON.stringify(data)}` }],
            };
        }
        catch (e) {
            return {
                content: [{ type: "text", text: `Figma plugin connection error: ${e.message}` }],
                isError: true,
            };
        }
    });
    // Register all design tools
    registerAllTools(server, bridge);
    return { server, bridge };
}
//# sourceMappingURL=server.js.map