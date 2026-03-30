import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerReadingTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "read_current_page",
    "Read the current Figma page structure. Returns a tree of nodes with IDs, names, types, positions, and sizes.",
    {
      depth: z.number().int().min(1).optional().default(3).describe("How deep to traverse the node tree (default 3)"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.READ_CURRENT_PAGE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "get_node_by_id",
    "Get detailed info about a specific node by its ID",
    {
      nodeId: z.string().describe("The Figma node ID"),
      includeChildren: z.boolean().optional().default(false),
      depth: z.number().int().min(1).optional().default(2),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.GET_NODE_BY_ID, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
