# Devign MCP - AI-Powered Figma Design Server

A Model Context Protocol (MCP) server that lets **any AI model** create, read, and edit Figma designs in real time. Not limited to Claude - works with OpenAI, Gemini, local models, Cursor, VS Code, or any MCP-compatible client.

## How It Works

```
┌──────────────┐     stdio or HTTP     ┌──────────────┐    WebSocket     ┌──────────────┐
│   AI Model   │ ◄──────────────────► │  MCP Server  │ ◄──────────────► │ Figma Plugin │
│ (any model)  │     MCP protocol      │  (Node.js)   │   localhost:3055 │  (in Figma)  │
└──────────────┘                       └──────────────┘                  └──────────────┘
```

The MCP server exposes 40 design tools to the AI. The Figma plugin runs inside your open Figma file and executes commands on the canvas via the Plugin API. Communication flows over a local WebSocket — no cloud services, no API keys, everything runs on your machine.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Figma Desktop](https://www.figma.com/downloads/) app
- An MCP-compatible AI client (Claude Code, Cursor, VS Code Copilot, etc.)

### 1. Install and Build

```bash
git clone <this-repo>
cd devign-figma-mcp
npm install
npm run build
```

### 2. Load the Figma Plugin

1. Open the Figma desktop app
2. Open any file you want to design in
3. Go to **Menu > Plugins > Development > Import plugin from manifest...**
4. Navigate to `packages/figma-plugin/manifest.json` and select it
5. Run the plugin: **Menu > Plugins > Development > Devign MCP Bridge**

You'll see the plugin panel with a connection status dot. It will show **red/Disconnected** until you start the MCP server.

### 3. Start the MCP Server

```bash
npm start
```

The plugin dot should turn **green/Connected**. You're ready to go.

### 4. Connect Your AI

#### Claude Code / Claude Desktop

Add to your MCP config (`~/.claude.json` or Claude Desktop settings):

```json
{
  "mcpServers": {
    "devign": {
      "command": "node",
      "args": ["/absolute/path/to/devign-figma-mcp/packages/mcp-server/dist/index.js"]
    }
  }
}
```

#### Cursor / VS Code

Add to `.cursor/mcp.json` or VS Code MCP settings:

```json
{
  "servers": {
    "devign": {
      "command": "node",
      "args": ["/absolute/path/to/devign-figma-mcp/packages/mcp-server/dist/index.js"]
    }
  }
}
```

#### Any HTTP-capable Client (OpenAI, Gemini, custom apps)

Start the server in HTTP mode:

```bash
DEVIGN_TRANSPORT=http npm start
```

Then point your client to:
- **MCP endpoint:** `POST http://127.0.0.1:3100/mcp`
- **Health check:** `GET http://127.0.0.1:3100/health`

This uses the [Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports) from the MCP spec, compatible with any client that supports it.

## What You Can Do

### Ask your AI things like:

- "Create a mobile login screen with email/password fields and a submit button"
- "Read the current page and describe the layout"
- "Set up a design system with color tokens, text styles, and elevation shadows"
- "Import this SVG icon and place it in the header"
- "Create a component with Light and Dark variants"
- "Apply auto-layout to the card frame with 16px padding and 12px gap"
- "Export the hero section as a 2x PNG"

### Full Tool List (40 tools)

| Category | Tools |
|---|---|
| **Creation** | `create_frame`, `add_rectangle`, `add_ellipse`, `add_text`, `add_shape`, `create_section`, `clone_node`, `set_image_fill` |
| **Components** | `create_component`, `list_components`, `create_instance`, `set_overrides`, `swap_component` |
| **Vectors** | `create_vector`, `create_from_svg`, `boolean_operation` (union/subtract/intersect/exclude) |
| **Styling** | `set_styles`, `list_styles`, `apply_style` |
| **Layout** | `apply_auto_layout` |
| **Reading** | `read_current_page`, `get_node_by_id`, `get_selection` |
| **Mutation** | `edit_node` (position, size, rotation, blend modes, constraints), `delete_node` |
| **Organization** | `group_nodes`, `flatten_node`, `create_page` |
| **Export** | `export_node` (PNG, SVG, JPG, PDF) |
| **Variables** | `list_variables`, `bind_variable`, `create_variable_collection`, `create_variable`, `set_variable_value` |
| **Design System** | `create_paint_style`, `create_text_style`, `create_effect_style`, `combine_as_variants`, `add_component_property` |
| **System** | `ping` |

### MCP Resources

AI clients that support MCP resources can read these directly:

| Resource | URI | Description |
|---|---|---|
| Current Page | `figma://current-page` | Live node tree of the open page |
| Selection | `figma://selection` | Currently selected nodes |
| Styles | `figma://styles` | All local paint, text, effect, grid styles |
| Variables | `figma://variables` | Variable collections and design tokens |
| Components | `figma://components` | Components on the current page |

### MCP Prompts

Guided workflows the AI can use:

| Prompt | Description |
|---|---|
| `create-screen` | Build a full page/screen from a description |
| `build-design-system` | Set up variables, styles, and tokens from scratch |
| `audit-accessibility` | Check contrast, text sizes, and touch targets |

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `DEVIGN_TRANSPORT` | `stdio` | Transport mode: `stdio` or `http` |
| `DEVIGN_WS_PORT` | `3055` | WebSocket port for plugin connection |
| `DEVIGN_WS_TIMEOUT` | `15000` | Command timeout in ms |
| `DEVIGN_HTTP_PORT` | `3100` | HTTP server port (when `DEVIGN_TRANSPORT=http`) |

## Plugin UI

When the plugin is running in Figma, you'll see:

- **Green dot** = Connected to MCP server, ready for AI commands
- **Red dot** = Disconnected, waiting for MCP server
- **Command counter** = How many commands have been processed
- **Activity log** = Real-time log of commands flowing between AI and Figma

The plugin auto-reconnects if the server restarts. Keep it open while working.

## Architecture

```
devign-figma-mcp/
├── shared/                 # Shared types and protocol definitions
│   └── src/
│       ├── commands.ts     # All command type constants
│       ├── protocol.ts     # Request/response interfaces
│       └── index.ts
├── packages/
│   ├── mcp-server/         # Node.js MCP server
│   │   └── src/
│   │       ├── index.ts    # Entry point, transport setup
│   │       ├── server.ts   # Tool/resource/prompt registration
│   │       ├── ws-bridge.ts # WebSocket bridge to plugin
│   │       ├── tools/      # 11 tool modules (40 tools total)
│   │       └── utils/      # Zod schemas, error helpers
│   └── figma-plugin/       # Figma plugin (runs in Figma)
│       ├── src/
│       │   ├── main.ts     # Command dispatcher
│       │   ├── ui.ts       # WebSocket client + UI
│       │   └── handlers/   # 11 handler modules
│       ├── manifest.json   # Figma plugin manifest
│       └── build.mjs       # esbuild config
└── package.json            # Workspace root
```

**How commands flow:**

1. AI sends a tool call (e.g. `create_frame`) to the MCP server
2. Server validates params with Zod, sends command over WebSocket to the plugin
3. Plugin's UI thread receives the message and forwards it to the main thread
4. Main thread dispatches to the appropriate handler, which calls the Figma Plugin API
5. Result flows back: handler → main thread → UI thread → WebSocket → MCP server → AI

## Development

```bash
# Watch mode for both server and plugin
npm run dev:server    # in one terminal
npm run dev:plugin    # in another terminal

# Build everything
npm run build

# Build individually
npm run build:server
npm run build:plugin
```

After changing plugin code, Figma will hot-reload if you ran the plugin via **Development > Import plugin from manifest**. For server changes, restart the server.

## Troubleshooting

**Plugin shows "Disconnected"**
- Make sure the MCP server is running (`npm start`)
- Check that port 3055 is not in use by another process
- Try restarting both the server and the plugin

**AI says "Figma plugin not connected"**
- Open Figma and run the Devign MCP Bridge plugin
- Wait for the green dot to appear before sending commands

**Commands time out**
- Increase the timeout: `DEVIGN_WS_TIMEOUT=30000 npm start`
- Complex operations (SVG import, large exports) may need more time

**"Unknown command" errors**
- Rebuild both packages: `npm run build`
- Restart the plugin in Figma

**HTTP transport not working**
- Make sure you set `DEVIGN_TRANSPORT=http` before starting
- Check `http://127.0.0.1:3100/health` to verify the server is up

## License

MIT
