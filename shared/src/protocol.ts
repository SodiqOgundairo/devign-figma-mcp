import type { CommandType } from "./commands.js";

export interface BridgeRequest {
  id: string;
  command: CommandType;
  params: Record<string, unknown>;
}

export interface BridgeResponse {
  id: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface SerializedNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  rotation?: number;
  fills?: unknown[];
  strokes?: unknown[];
  characters?: string;
  layoutMode?: string;
  children?: SerializedNode[];
}
