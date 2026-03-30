import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerLayoutTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "apply_auto_layout",
    "Apply auto-layout to a frame node",
    {
      nodeId: z.string().describe("Target frame node ID"),
      direction: z.enum(["HORIZONTAL", "VERTICAL"]).describe("Layout direction"),
      spacing: z.number().min(0).optional().default(0).describe("Gap between children"),
      paddingTop: z.number().min(0).optional().default(0),
      paddingRight: z.number().min(0).optional().default(0),
      paddingBottom: z.number().min(0).optional().default(0),
      paddingLeft: z.number().min(0).optional().default(0),
      primaryAxisAlignItems: z.enum(["MIN", "CENTER", "MAX", "SPACE_BETWEEN"]).optional().default("MIN"),
      counterAxisAlignItems: z.enum(["MIN", "CENTER", "MAX"]).optional().default("MIN"),
      primaryAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional().default("AUTO"),
      counterAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional().default("AUTO"),
      layoutWrap: z.enum(["NO_WRAP", "WRAP"]).optional().describe("Enable wrapping for auto-layout children"),
      counterAxisSpacing: z.number().min(0).optional().describe("Spacing between rows when wrapping"),
      counterAxisAlignContent: z.enum(["AUTO", "SPACE_BETWEEN"]).optional().describe("Distribution of wrapped rows"),
      minWidth: z.number().min(0).optional(),
      maxWidth: z.number().min(0).optional(),
      minHeight: z.number().min(0).optional(),
      maxHeight: z.number().min(0).optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.APPLY_AUTO_LAYOUT, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
