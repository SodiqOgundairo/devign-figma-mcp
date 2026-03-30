import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerExportTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "export_node",
    "Export a node as PNG, SVG, JPG, or PDF",
    {
      nodeId: z.string().describe("Node ID to export"),
      format: z.enum(["PNG", "SVG", "JPG", "PDF"]).default("PNG"),
      scale: z.number().positive().optional().default(1).describe("Export scale (1 = 1x, 2 = 2x)"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.EXPORT_NODE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
