import { z } from "zod";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";
export function registerExportTools(server, bridge) {
    server.tool("export_node", "Export a node as PNG, SVG, JPG, or PDF", {
        nodeId: z.string().describe("Node ID to export"),
        format: z.enum(["PNG", "SVG", "JPG", "PDF"]).default("PNG"),
        scale: z.number().positive().optional().default(1).describe("Export scale (1 = 1x, 2 = 2x)"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.EXPORT_NODE, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
}
//# sourceMappingURL=export.js.map