import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerOrganizationTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "group_nodes",
    "Group multiple nodes together",
    {
      nodeIds: z.array(z.string()).min(1).describe("Array of node IDs to group"),
      name: z.string().optional().default("Group"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.GROUP_NODES, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "flatten_node",
    "Flatten a node (merges vector paths)",
    {
      nodeId: z.string(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.FLATTEN_NODE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "create_page",
    "Create a new page in the Figma file",
    {
      name: z.string().describe("Page name"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_PAGE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
