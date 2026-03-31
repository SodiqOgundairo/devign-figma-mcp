import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerMutationTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "edit_node",
    "Edit properties of an existing node: position, size, name, visibility, rotation, blend mode, constraints, and auto-layout child properties",
    {
      nodeId: z.string().describe("Target node ID"),
      name: z.string().optional(),
      x: z.number().optional(),
      y: z.number().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
      visible: z.boolean().optional(),
      locked: z.boolean().optional(),
      rotation: z.number().optional().describe("Rotation in degrees"),
      characters: z.string().optional().describe("New text content (text nodes only)"),
      // Blend mode
      blendMode: z.enum([
        "NORMAL", "DARKEN", "MULTIPLY", "COLOR_BURN", "LINEAR_BURN",
        "LIGHTEN", "SCREEN", "COLOR_DODGE", "LINEAR_DODGE",
        "OVERLAY", "SOFT_LIGHT", "HARD_LIGHT",
        "DIFFERENCE", "EXCLUSION", "HUE", "SATURATION", "COLOR", "LUMINOSITY",
      ]).optional(),
      // Constraints (non-auto-layout frames)
      constraints: z.object({
        horizontal: z.enum(["MIN", "CENTER", "MAX", "STRETCH", "SCALE"]),
        vertical: z.enum(["MIN", "CENTER", "MAX", "STRETCH", "SCALE"]),
      }).optional().describe("Positioning constraints within parent frame"),
      // Auto-layout child properties
      layoutAlign: z.enum(["INHERIT", "STRETCH"]).optional()
        .describe("Cross-axis alignment within parent auto-layout"),
      layoutGrow: z.number().min(0).max(1).optional()
        .describe("0 = fixed size, 1 = fill container along primary axis"),
      layoutSizingHorizontal: z.enum(["FIXED", "HUG", "FILL"]).optional()
        .describe("Horizontal sizing behavior in auto-layout"),
      layoutSizingVertical: z.enum(["FIXED", "HUG", "FILL"]).optional()
        .describe("Vertical sizing behavior in auto-layout"),
      layoutPositioning: z.enum(["AUTO", "ABSOLUTE"]).optional()
        .describe("AUTO = in flow, ABSOLUTE = absolutely positioned within auto-layout parent"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.EDIT_NODE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "delete_node",
    "Delete a node from the canvas",
    {
      nodeId: z.string().describe("Node ID to delete"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.DELETE_NODE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
