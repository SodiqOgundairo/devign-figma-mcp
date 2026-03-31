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
  fontSize?: number;
  fontName?: { family: string; style: string };
  layoutMode?: string;
  itemSpacing?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  // Auto-layout child properties
  layoutAlign?: string;
  layoutGrow?: number;
  layoutSizingHorizontal?: string;
  layoutSizingVertical?: string;
  layoutPositioning?: string;
  // Visual
  blendMode?: string;
  cornerRadius?: number;
  // Constraints
  constraints?: { horizontal: string; vertical: string };
  // Component info
  componentId?: string;
  children?: SerializedNode[];
}
