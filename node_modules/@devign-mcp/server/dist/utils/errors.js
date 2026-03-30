export function ensureConnected(bridge) {
    if (!bridge.isConnected()) {
        throw new Error("Figma plugin not connected. Open the Devign MCP Bridge plugin in Figma.");
    }
}
export function toolResult(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
export function toolError(message) {
    return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
    };
}
//# sourceMappingURL=errors.js.map