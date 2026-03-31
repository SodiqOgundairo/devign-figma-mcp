import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { fillSchema, effectSchema } from "../utils/schemas.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerDesignSystemTools(server: McpServer, bridge: WsBridge) {
  // ── Variable Creation ──

  server.tool(
    "create_variable_collection",
    "Create a new variable collection (token group) with optional modes like Light/Dark",
    {
      name: z.string().describe("Collection name, e.g. 'Colors', 'Spacing'"),
      modes: z.array(z.string()).optional()
        .describe("Mode names, e.g. ['Light', 'Dark']. First mode always exists."),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_VARIABLE_COLLECTION, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "create_variable",
    "Create a new design token variable in a collection",
    {
      name: z.string().describe("Variable name, e.g. 'primary-500' or 'spacing/md'"),
      collectionId: z.string().describe("Collection ID to add the variable to"),
      resolvedType: z.enum(["COLOR", "FLOAT", "STRING", "BOOLEAN"])
        .describe("Variable type"),
      values: z.record(z.string(), z.unknown()).optional()
        .describe("Values per mode name, e.g. { 'Light': { r:0, g:0, b:1, a:1 }, 'Dark': { r:0.5, g:0.5, b:1, a:1 } }"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_VARIABLE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "set_variable_value",
    "Set or update a variable's value for a specific mode",
    {
      variableId: z.string(),
      modeName: z.string().describe("Mode name to set value for"),
      value: z.unknown().describe("Value: RGBA object for COLOR, number for FLOAT, string/boolean for others"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.SET_VARIABLE_VALUE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  // ── Style Creation ──

  server.tool(
    "create_paint_style",
    "Create a new local paint style (color/gradient) in the design system",
    {
      name: z.string().describe("Style name. Use '/' for folders, e.g. 'Brand/Primary'"),
      paints: z.array(fillSchema).min(1).describe("Paint fills for this style"),
      description: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_PAINT_STYLE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "create_text_style",
    "Create a new local text style in the design system",
    {
      name: z.string().describe("Style name, e.g. 'Heading/H1'"),
      fontFamily: z.string().default("Inter"),
      fontWeight: z.string().default("Regular"),
      fontSize: z.number().positive(),
      lineHeight: z.number().positive().optional().describe("Line height in pixels"),
      letterSpacing: z.number().optional().describe("Letter spacing in pixels"),
      textAlignHorizontal: z.enum(["LEFT", "CENTER", "RIGHT", "JUSTIFIED"]).optional(),
      description: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_TEXT_STYLE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "create_effect_style",
    "Create a new local effect style (shadows, blurs)",
    {
      name: z.string().describe("Style name, e.g. 'Elevation/Medium'"),
      effects: z.array(effectSchema).min(1),
      description: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_EFFECT_STYLE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  // ── Component Variants ──

  server.tool(
    "combine_as_variants",
    "Combine multiple components into a component set (variant group)",
    {
      componentIds: z.array(z.string()).min(2)
        .describe("IDs of component nodes to combine as variants"),
      name: z.string().optional().describe("Name for the component set"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.COMBINE_AS_VARIANTS, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "add_component_property",
    "Add a component property (text, boolean, or instance-swap) to a component",
    {
      componentId: z.string().describe("Component node ID"),
      propertyName: z.string().describe("Property name"),
      propertyType: z.enum(["TEXT", "BOOLEAN", "INSTANCE_SWAP"])
        .describe("Property type"),
      defaultValue: z.union([z.string(), z.boolean()]).describe("Default value"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.ADD_COMPONENT_PROPERTY, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
