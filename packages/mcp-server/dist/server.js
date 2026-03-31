import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createWsBridge } from "./ws-bridge.js";
import { registerAllTools } from "./tools/index.js";
import { z } from "zod";
import { CommandType } from "./types.js";
export function createDevignServer(config) {
    const server = new McpServer({
        name: "devign-mcp",
        version: "2.0.0",
    });
    const bridge = createWsBridge({
        port: config.wsPort,
        timeout: config.wsTimeout,
    });
    // ── System Tools ──
    server.tool("ping", "Check if the Figma plugin is connected and responsive", {}, async () => {
        if (!bridge.isConnected()) {
            return {
                content: [{ type: "text", text: "Figma plugin is NOT connected. Please open the Devign MCP Bridge plugin in Figma." }],
            };
        }
        try {
            const data = await bridge.send(CommandType.PING, {});
            return {
                content: [{ type: "text", text: `Figma plugin connected. ${JSON.stringify(data)}` }],
            };
        }
        catch (e) {
            return {
                content: [{ type: "text", text: `Figma plugin connection error: ${e.message}` }],
                isError: true,
            };
        }
    });
    // ── Register All Design Tools ──
    registerAllTools(server, bridge);
    // ── MCP Resources ──
    server.resource("current-page", "figma://current-page", { description: "Current Figma page structure (node tree)", mimeType: "application/json" }, async () => {
        if (!bridge.isConnected()) {
            return { contents: [{ uri: "figma://current-page", text: '{"error":"Plugin not connected"}', mimeType: "application/json" }] };
        }
        try {
            const data = await bridge.send(CommandType.READ_CURRENT_PAGE, { depth: 3 });
            return { contents: [{ uri: "figma://current-page", text: JSON.stringify(data, null, 2), mimeType: "application/json" }] };
        }
        catch {
            return { contents: [{ uri: "figma://current-page", text: '{"error":"Failed to read page"}', mimeType: "application/json" }] };
        }
    });
    server.resource("selection", "figma://selection", { description: "Currently selected nodes in Figma", mimeType: "application/json" }, async () => {
        if (!bridge.isConnected()) {
            return { contents: [{ uri: "figma://selection", text: '{"error":"Plugin not connected"}', mimeType: "application/json" }] };
        }
        try {
            const data = await bridge.send(CommandType.GET_SELECTION, { depth: 2 });
            return { contents: [{ uri: "figma://selection", text: JSON.stringify(data, null, 2), mimeType: "application/json" }] };
        }
        catch {
            return { contents: [{ uri: "figma://selection", text: '{"error":"Failed to get selection"}', mimeType: "application/json" }] };
        }
    });
    server.resource("styles", "figma://styles", { description: "Local paint, text, effect, and grid styles", mimeType: "application/json" }, async () => {
        if (!bridge.isConnected()) {
            return { contents: [{ uri: "figma://styles", text: '{"error":"Plugin not connected"}', mimeType: "application/json" }] };
        }
        try {
            const data = await bridge.send(CommandType.LIST_STYLES, {});
            return { contents: [{ uri: "figma://styles", text: JSON.stringify(data, null, 2), mimeType: "application/json" }] };
        }
        catch {
            return { contents: [{ uri: "figma://styles", text: '{"error":"Failed to list styles"}', mimeType: "application/json" }] };
        }
    });
    server.resource("variables", "figma://variables", { description: "Local variable collections and design tokens", mimeType: "application/json" }, async () => {
        if (!bridge.isConnected()) {
            return { contents: [{ uri: "figma://variables", text: '{"error":"Plugin not connected"}', mimeType: "application/json" }] };
        }
        try {
            const data = await bridge.send(CommandType.LIST_VARIABLES, {});
            return { contents: [{ uri: "figma://variables", text: JSON.stringify(data, null, 2), mimeType: "application/json" }] };
        }
        catch {
            return { contents: [{ uri: "figma://variables", text: '{"error":"Failed to list variables"}', mimeType: "application/json" }] };
        }
    });
    server.resource("components", "figma://components", { description: "Components available on the current page", mimeType: "application/json" }, async () => {
        if (!bridge.isConnected()) {
            return { contents: [{ uri: "figma://components", text: '{"error":"Plugin not connected"}', mimeType: "application/json" }] };
        }
        try {
            const data = await bridge.send(CommandType.LIST_COMPONENTS, {});
            return { contents: [{ uri: "figma://components", text: JSON.stringify(data, null, 2), mimeType: "application/json" }] };
        }
        catch {
            return { contents: [{ uri: "figma://components", text: '{"error":"Failed to list components"}', mimeType: "application/json" }] };
        }
    });
    // ── MCP Prompts ──
    server.prompt("create-screen", "Guided workflow: create a full screen/page layout in Figma from a description", {
        description: z.string().describe("Describe the screen you want to create"),
        width: z.string().optional().describe("Screen width, e.g. '1440' for desktop, '390' for mobile"),
        designSystem: z.string().optional().describe("Design system to use: 'material', 'tailwind', or 'custom'"),
    }, async (args) => ({
        messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `You are a senior UI/UX designer creating a Figma design. Create the following screen using the devign-mcp tools.

SCREEN DESCRIPTION: ${args.description}
TARGET WIDTH: ${args.width ?? "1440"} pixels
DESIGN SYSTEM: ${args.designSystem ?? "modern minimal"}

WORKFLOW:
1. First call \`ping\` to verify the Figma plugin is connected
2. Read the current page with \`read_current_page\` to understand existing content
3. Check for existing styles with \`list_styles\` and variables with \`list_variables\`
4. Create a top-level frame sized for the target device
5. Build the layout using auto-layout frames for structure
6. Add text, shapes, and images as needed
7. Apply consistent spacing, colors, and typography
8. Use design tokens (variables) where possible

DESIGN PRINCIPLES:
- Use 8px grid spacing (8, 16, 24, 32, 48, 64)
- Ensure readable text sizes (min 14px body, 12px captions)
- Use a clear visual hierarchy with size and weight contrast
- Apply consistent border radius (0, 4, 8, 12, 16, 9999 for pills)
- Use auto-layout everywhere for responsive structure
- Name all layers descriptively

Create the design now.`,
                },
            }],
    }));
    server.prompt("build-design-system", "Set up a complete design system with variables, styles, and base components", {
        name: z.string().describe("Design system name"),
        colorPalette: z.string().optional().describe("Describe your color palette, e.g. 'blue primary, gray neutrals, red errors'"),
        includeTypography: z.string().optional().describe("'yes' to include type scale"),
        includeShadows: z.string().optional().describe("'yes' to include elevation shadows"),
    }, async (args) => ({
        messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `Set up a design system called "${args.name}" in Figma using the devign-mcp tools.

COLOR PALETTE: ${args.colorPalette ?? "neutral grays, blue primary, green success, red error, yellow warning"}

STEPS:
1. Ping to verify connection
2. Create a variable collection called "${args.name}/Colors" with Light and Dark modes
3. Create color variables for each palette (50-900 scale for primary/neutral, single values for semantic)
4. Create a variable collection "${args.name}/Spacing" with values: 2, 4, 8, 12, 16, 20, 24, 32, 48, 64
5. Create a variable collection "${args.name}/Radius" with values: 0, 2, 4, 8, 12, 16, 9999
${args.includeTypography === "yes" ? `6. Create text styles: Display/Large (48px Bold), Display/Small (36px Bold), Heading/H1 (32px Semibold), Heading/H2 (24px Semibold), Heading/H3 (20px Semibold), Body/Large (18px Regular), Body/Default (16px Regular), Body/Small (14px Regular), Caption (12px Regular)` : ""}
${args.includeShadows === "yes" ? `7. Create effect styles: Elevation/Small (0,1,2 shadow), Elevation/Medium (0,4,8 shadow), Elevation/Large (0,8,24 shadow)` : ""}

Create paint styles for the main colors too (Primary, Secondary, Surface, Background, Error, etc.)

Build this design system now.`,
                },
            }],
    }));
    server.prompt("audit-accessibility", "Audit the current page for accessibility issues (contrast, text size, touch targets)", {}, async () => ({
        messages: [{
                role: "user",
                content: {
                    type: "text",
                    text: `Audit the current Figma page for accessibility issues using the devign-mcp tools.

STEPS:
1. Call \`read_current_page\` with depth 5 to get the full node tree
2. Analyze every text node for:
   - Font size < 12px (too small)
   - Poor contrast (text color vs parent background)
3. Check interactive elements for:
   - Touch target < 44x44px
   - Missing labels/names
4. Check color usage for:
   - Information conveyed only by color
   - Low contrast fill combinations
5. Report findings as a structured list with node IDs so issues can be fixed

Run the audit now and report all findings.`,
                },
            }],
    }));
    return { server, bridge };
}
//# sourceMappingURL=server.js.map