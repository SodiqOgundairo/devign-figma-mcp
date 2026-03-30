// Mirror of shared protocol types for the Figma plugin
// (can't use npm workspace packages in Figma plugin sandbox)

export interface BridgeRequest {
  id: string;
  command: string;
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
  // Auto-layout child properties
  layoutAlign?: string;
  layoutGrow?: number;
  layoutSizingHorizontal?: string;
  layoutSizingVertical?: string;
  layoutPositioning?: string;
  // Component info
  componentId?: string;
  children?: SerializedNode[];
}
