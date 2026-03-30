import { z } from "zod";
import { CommandType } from "../types.js";
import { toolResult, toolError } from "../utils/errors.js";
export function registerVariableTools(server, bridge) {
    server.tool("list_variables", "List all local variable collections and their variables (design tokens)", {
        collectionName: z.string().optional().describe("Filter by collection name (substring match)"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.LIST_VARIABLES, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
    server.tool("bind_variable", "Bind a variable (design token) to a node property", {
        nodeId: z.string().describe("Target node ID"),
        variableId: z.string().describe("Variable ID to bind"),
        field: z.enum([
            "fills", "strokes",
            "width", "height",
            "minWidth", "maxWidth", "minHeight", "maxHeight",
            "itemSpacing", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
            "counterAxisSpacing",
            "opacity",
            "cornerRadius",
            "topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius",
        ]).describe("The property to bind the variable to"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.BIND_VARIABLE, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
}
//# sourceMappingURL=variables.js.map