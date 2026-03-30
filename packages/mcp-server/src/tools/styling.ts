import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { fillSchema, strokeSchema } from "../utils/schemas.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerStylingTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "list_styles",
    "List available paint, text, effect, and grid styles in the file",
    {
      styleType: z.enum(["PAINT", "TEXT", "EFFECT", "GRID"]).optional().describe("Filter by style type"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.LIST_STYLES, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "apply_style",
    "Apply a named style to a node by style ID",
    {
      nodeId: z.string().describe("Target node ID"),
      styleId: z.string().describe("The style ID to apply"),
      property: z.enum(["fill", "stroke", "text", "effect", "grid"]).optional()
        .describe("Which property to apply the style to; inferred from style type if omitted"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.APPLY_STYLE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "set_styles",
    "Set visual styles on a node: fills, strokes, effects, typography, opacity, corner radius",
    {
      nodeId: z.string().describe("Target node ID"),
      fills: z.array(fillSchema).optional(),
      strokes: z.array(strokeSchema).optional(),
      strokeWeight: z.number().min(0).optional(),
      opacity: z.number().min(0).max(1).optional(),
      cornerRadius: z.number().min(0).optional(),
      // Typography (only applies to text nodes)
      fontSize: z.number().positive().optional(),
      fontFamily: z.string().optional(),
      fontWeight: z.string().optional(),
      letterSpacing: z.number().optional(),
      lineHeight: z.number().positive().optional().describe("Line height in pixels"),
      textAlignHorizontal: z.enum(["LEFT", "CENTER", "RIGHT", "JUSTIFIED"]).optional(),
      textAlignVertical: z.enum(["TOP", "CENTER", "BOTTOM"]).optional(),
      // Effects
      effects: z.array(z.object({
        type: z.enum(["DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR", "BACKGROUND_BLUR"]),
        visible: z.boolean().default(true),
        radius: z.number().min(0).optional(),
        color: z.object({
          r: z.number().min(0).max(1),
          g: z.number().min(0).max(1),
          b: z.number().min(0).max(1),
          a: z.number().min(0).max(1).default(1),
        }).optional(),
        offset: z.object({
          x: z.number(),
          y: z.number(),
        }).optional(),
        spread: z.number().optional(),
      })).optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.SET_STYLES, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
