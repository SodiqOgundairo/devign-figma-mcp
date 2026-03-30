import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { WsBridge } from "../ws-bridge.js";
import { registerCreationTools } from "./creation.js";
import { registerComponentTools } from "./components.js";
import { registerStylingTools } from "./styling.js";
import { registerLayoutTools } from "./layout.js";
import { registerReadingTools } from "./reading.js";
import { registerMutationTools } from "./mutation.js";
import { registerOrganizationTools } from "./organization.js";
import { registerExportTools } from "./export.js";
import { registerVariableTools } from "./variables.js";

export function registerAllTools(server: McpServer, bridge: WsBridge) {
  registerCreationTools(server, bridge);
  registerComponentTools(server, bridge);
  registerStylingTools(server, bridge);
  registerLayoutTools(server, bridge);
  registerReadingTools(server, bridge);
  registerMutationTools(server, bridge);
  registerOrganizationTools(server, bridge);
  registerExportTools(server, bridge);
  registerVariableTools(server, bridge);
}
