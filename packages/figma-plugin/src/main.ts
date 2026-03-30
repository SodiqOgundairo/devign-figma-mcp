// Main plugin thread — has access to figma.* API
// Receives commands from UI thread, dispatches to handlers

import type { BridgeRequest, BridgeResponse } from "./types";
import { handleCreation } from "./handlers/creation";
import { handleStyling } from "./handlers/styling";
import { handleLayout } from "./handlers/layout";
import { handleReading } from "./handlers/reading";
import { handleMutation } from "./handlers/mutation";
import { handleOrganization } from "./handlers/organization";
import { handleExport } from "./handlers/export";
import { handleComponents } from "./handlers/components";
import { handleVariables } from "./handlers/variables";

figma.showUI(__html__, { visible: true, width: 280, height: 180 });

figma.ui.onmessage = async (msg: BridgeRequest) => {
  if (!msg || !msg.id || !msg.command) return;

  let response: BridgeResponse;

  try {
    const data = await dispatch(msg.command, msg.params);
    response = { id: msg.id, success: true, data };
  } catch (err: any) {
    response = { id: msg.id, success: false, error: err.message ?? String(err) };
  }

  figma.ui.postMessage(response);
};

async function dispatch(command: string, params: Record<string, unknown>): Promise<unknown> {
  switch (command) {
    // Creation
    case "create_frame":
    case "create_component":
    case "add_text":
    case "add_rectangle":
    case "add_ellipse":
    case "add_shape":
      return handleCreation(command, params);

    // Styling
    case "set_styles":
    case "list_styles":
    case "apply_style":
      return handleStyling(command, params);

    // Layout
    case "apply_auto_layout":
      return handleLayout(params);

    // Reading
    case "read_current_page":
    case "get_node_by_id":
      return handleReading(command, params);

    // Mutation
    case "edit_node":
    case "delete_node":
      return handleMutation(command, params);

    // Organization
    case "group_nodes":
    case "flatten_node":
    case "create_page":
      return handleOrganization(command, params);

    // Components (instances)
    case "list_components":
    case "create_instance":
    case "set_overrides":
    case "swap_component":
      return handleComponents(command, params);

    // Variables
    case "list_variables":
    case "bind_variable":
      return handleVariables(command, params);

    // Export
    case "export_node":
      return handleExport(params);

    // System
    case "ping":
      return { status: "ok", page: figma.currentPage.name };

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}
