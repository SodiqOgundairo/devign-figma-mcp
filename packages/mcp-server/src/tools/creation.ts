import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { fillSchema } from "../utils/schemas.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerCreationTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "create_frame",
    "Create a new frame (artboard) on the Figma canvas",
    {
      name: z.string().describe("Frame name"),
      width: z.number().positive().describe("Width in pixels"),
      height: z.number().positive().describe("Height in pixels"),
      x: z.number().default(0),
      y: z.number().default(0),
      fills: z.array(fillSchema).optional().describe("Background fills"),
      parentId: z.string().optional().describe("Parent node ID; defaults to current page"),
      autoLayout: z.object({
        direction: z.enum(["HORIZONTAL", "VERTICAL"]),
        spacing: z.number().min(0).optional(),
        paddingTop: z.number().min(0).optional(),
        paddingRight: z.number().min(0).optional(),
        paddingBottom: z.number().min(0).optional(),
        paddingLeft: z.number().min(0).optional(),
        primaryAxisAlignItems: z.enum(["MIN", "CENTER", "MAX", "SPACE_BETWEEN"]).optional(),
        counterAxisAlignItems: z.enum(["MIN", "CENTER", "MAX"]).optional(),
        primaryAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional(),
        counterAxisSizingMode: z.enum(["FIXED", "AUTO"]).optional(),
        layoutWrap: z.enum(["NO_WRAP", "WRAP"]).optional(),
      }).optional().describe("Apply auto-layout at creation time"),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_FRAME, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "add_rectangle",
    "Add a rectangle to the canvas",
    {
      width: z.number().positive(),
      height: z.number().positive(),
      x: z.number().default(0),
      y: z.number().default(0),
      name: z.string().optional(),
      cornerRadius: z.number().min(0).optional(),
      fills: z.array(fillSchema).optional(),
      parentId: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.ADD_RECTANGLE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "add_ellipse",
    "Add an ellipse/circle to the canvas",
    {
      width: z.number().positive(),
      height: z.number().positive(),
      x: z.number().default(0),
      y: z.number().default(0),
      name: z.string().optional(),
      fills: z.array(fillSchema).optional(),
      parentId: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.ADD_ELLIPSE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "add_text",
    "Add a text node to the canvas. Font defaults to Inter Regular.",
    {
      content: z.string().describe("The text content"),
      x: z.number().default(0),
      y: z.number().default(0),
      name: z.string().optional(),
      fontSize: z.number().positive().optional().default(16),
      fontFamily: z.string().optional().default("Inter"),
      fontWeight: z.string().optional().default("Regular").describe("Font style/weight, e.g. Regular, Bold, Medium"),
      fills: z.array(fillSchema).optional().describe("Text color as fills"),
      width: z.number().positive().optional().describe("Fixed width; text will wrap"),
      parentId: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.ADD_TEXT, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "add_shape",
    "Add a polygon, star, or line to the canvas",
    {
      shapeType: z.enum(["POLYGON", "STAR", "LINE"]),
      width: z.number().positive(),
      height: z.number().positive(),
      x: z.number().default(0),
      y: z.number().default(0),
      name: z.string().optional(),
      pointCount: z.number().int().min(3).optional().describe("Number of points for polygon/star"),
      fills: z.array(fillSchema).optional(),
      parentId: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.ADD_SHAPE, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
