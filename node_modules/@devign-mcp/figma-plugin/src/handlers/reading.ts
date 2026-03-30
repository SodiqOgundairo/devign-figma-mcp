import type { SerializedNode } from "../types";

function serializeNode(node: SceneNode, depth: number): SerializedNode {
  const result: SerializedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    visible: node.visible,
    locked: node.locked,
    opacity: node.opacity,
    rotation: node.rotation,
  };

  if ("fills" in node && Array.isArray(node.fills)) {
    result.fills = (node.fills as Paint[]).map((f) => {
      if (f.type === "SOLID") {
        return { type: "SOLID", color: f.color, opacity: f.opacity };
      }
      return { type: f.type };
    });
  }

  if ("strokes" in node && Array.isArray(node.strokes)) {
    result.strokes = (node.strokes as Paint[]).map((s) => {
      if (s.type === "SOLID") {
        return { type: "SOLID", color: s.color, opacity: s.opacity };
      }
      return { type: s.type };
    });
  }

  if (node.type === "TEXT") {
    result.characters = (node as TextNode).characters;
  }

  if ("layoutMode" in node) {
    result.layoutMode = (node as FrameNode).layoutMode;
  }

  // Auto-layout child properties
  if ("layoutAlign" in node) result.layoutAlign = (node as any).layoutAlign;
  if ("layoutGrow" in node) result.layoutGrow = (node as any).layoutGrow;
  if ("layoutSizingHorizontal" in node) result.layoutSizingHorizontal = (node as any).layoutSizingHorizontal;
  if ("layoutSizingVertical" in node) result.layoutSizingVertical = (node as any).layoutSizingVertical;
  if ("layoutPositioning" in node) result.layoutPositioning = (node as any).layoutPositioning;

  // Component instance info
  if (node.type === "INSTANCE") {
    const mainComponent = (node as InstanceNode).mainComponent;
    if (mainComponent) result.componentId = mainComponent.id;
  }

  if ("children" in node && depth > 1) {
    result.children = (node as ChildrenMixin).children.map((child) =>
      serializeNode(child as SceneNode, depth - 1)
    );
  }

  return result;
}

export async function handleReading(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    case "read_current_page": {
      const depth = p.depth ?? 3;
      const page = figma.currentPage;
      return {
        pageId: page.id,
        pageName: page.name,
        children: page.children.map((child) => serializeNode(child, depth)),
      };
    }

    case "get_node_by_id": {
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      if (!("x" in node)) throw new Error(`Node ${p.nodeId} is not a scene node`);
      const depth = p.includeChildren ? (p.depth ?? 2) : 1;
      return serializeNode(node as SceneNode, depth);
    }

    default:
      throw new Error(`Unknown reading command: ${command}`);
  }
}
