import { z } from "zod";
import { CommandType } from "../types.js";
import { fillSchema } from "../utils/schemas.js";
import { toolResult, toolError } from "../utils/errors.js";
export function registerComponentTools(server, bridge) {
    server.tool("create_component", "Create a new reusable component", {
        name: z.string().describe("Component name"),
        width: z.number().positive(),
        height: z.number().positive(),
        x: z.number().default(0),
        y: z.number().default(0),
        fills: z.array(fillSchema).optional().describe("Background fills"),
        parentId: z.string().optional(),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.CREATE_COMPONENT, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
    server.tool("list_components", "List available components in the current file", {
        nameFilter: z.string().optional().describe("Filter components by name (substring match)"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.LIST_COMPONENTS, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
    server.tool("create_instance", "Create an instance of an existing component", {
        componentId: z.string().describe("The component node ID to instantiate"),
        x: z.number().default(0),
        y: z.number().default(0),
        parentId: z.string().optional().describe("Parent node ID; defaults to current page"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.CREATE_INSTANCE, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
    server.tool("set_overrides", "Set property overrides on a component instance", {
        nodeId: z.string().describe("The component instance node ID"),
        overrides: z.array(z.object({
            propertyName: z.string().describe("Component property name"),
            value: z.union([z.string(), z.number(), z.boolean()]).describe("Override value"),
        })).describe("Array of property overrides to set"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.SET_OVERRIDES, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
    server.tool("swap_component", "Swap a component instance to a different component", {
        instanceId: z.string().describe("The existing instance node ID"),
        newComponentId: z.string().describe("The component to swap to"),
    }, async (args) => {
        try {
            const data = await bridge.send(CommandType.SWAP_COMPONENT, args);
            return toolResult(data);
        }
        catch (e) {
            return toolError(e.message);
        }
    });
}
//# sourceMappingURL=components.js.map