import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { CommandType } from "../types.js";
import { fillSchema } from "../utils/schemas.js";
import { toolResult, toolError } from "../utils/errors.js";

export function registerVectorTools(server: McpServer, bridge: WsBridge) {
  server.tool(
    "create_vector",
    "Create a vector node from SVG path data (d attribute). Use for custom shapes, icons, and illustrations.",
    {
      name: z.string().optional().default("Vector"),
      paths: z.array(z.object({
        data: z.string().describe("SVG path d attribute, e.g. 'M 0 0 L 100 0 L 100 100 Z'"),
        windingRule: z.enum(["NONZERO", "EVENODD"]).optional().default("NONZERO"),
      })).min(1).describe("Array of SVG path data strings"),
      width: z.number().positive().optional().describe("Desired width (paths will be scaled)"),
      height: z.number().positive().optional().describe("Desired height (paths will be scaled)"),
      x: z.number().default(0),
      y: z.number().default(0),
      fills: z.array(fillSchema).optional(),
      parentId: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_VECTOR, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "create_from_svg",
    "Import SVG markup as a Figma node tree. Great for icons, logos, and illustrations.",
    {
      svg: z.string().describe("Full SVG markup string"),
      x: z.number().default(0),
      y: z.number().default(0),
      name: z.string().optional(),
      parentId: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.CREATE_FROM_SVG, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );

  server.tool(
    "boolean_operation",
    "Perform a boolean operation (union, subtract, intersect, exclude) on two or more nodes to create complex shapes",
    {
      operation: z.enum(["UNION", "SUBTRACT", "INTERSECT", "EXCLUDE"])
        .describe("Boolean operation type"),
      nodeIds: z.array(z.string()).min(2)
        .describe("Node IDs to combine (order matters for SUBTRACT)"),
      name: z.string().optional(),
    },
    async (args) => {
      try {
        const data = await bridge.send(CommandType.BOOLEAN_OPERATION, args);
        return toolResult(data);
      } catch (e: any) {
        return toolError(e.message);
      }
    }
  );
}
