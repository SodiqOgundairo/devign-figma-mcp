import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type WsBridge } from "./ws-bridge.js";
export interface ServerConfig {
    wsPort: number;
    wsTimeout?: number;
}
export declare function createDevignServer(config: ServerConfig): {
    server: McpServer;
    bridge: WsBridge;
};
//# sourceMappingURL=server.d.ts.map