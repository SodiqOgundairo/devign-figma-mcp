import { z } from "zod";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";
export function registerMutationTools(server, bridge) {
    server.tool("edit_node", "Edit properties of an existing node: position, size, name, visibility, rotation, and auto-layout child properties", {
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
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.EDIT_NODE, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
    server.tool("delete_node", "Delete a node from the canvas", {
        nodeId: z.string().describe("Node ID to delete"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.DELETE_NODE, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
}
//# sourceMappingURL=mutation.js.map