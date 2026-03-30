import type { SerializedNode } from "../types";

function getParent(parentId?: string): BaseNode & ChildrenMixin {
  if (parentId) {
    const node = figma.getNodeById(parentId);
    if (!node) throw new Error(`Parent node not found: ${parentId}`);
    if (!("children" in node)) throw new Error(`Node ${parentId} cannot have children`);
    return node as BaseNode & ChildrenMixin;
  }
  return figma.currentPage;
}

function applyFills(node: GeometryMixin, fills?: unknown[]) {
  if (!fills || fills.length === 0) return;
  const paintFills: Paint[] = fills.map((f: any) => {
    if (f.type === "SOLID" && f.color) {
      return {
        type: "SOLID",
        color: { r: f.color.r, g: f.color.g, b: f.color.b },
        opacity: f.opacity ?? 1,
        visible: f.visible ?? true,
      };
    }
    return { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
  });
  node.fills = paintFills;
}

function nodeResult(node: SceneNode) {
  return {
    nodeId: node.id,
    name: node.name,
    type: node.type,
  };
}

export async function handleCreation(command: string, params: Record<string, unknown>) {
  const p = params as any;
  const parent = getParent(p.parentId);

  switch (command) {
    case "create_frame": {
      const frame = figma.createFrame();
      frame.name = p.name ?? "Frame";
      frame.resize(p.width ?? 100, p.height ?? 100);
      frame.x = p.x ?? 0;
      frame.y = p.y ?? 0;
      applyFills(frame, p.fills);
      if (p.autoLayout) {
        const al = p.autoLayout;
        frame.layoutMode = al.direction;
        if (al.spacing !== undefined) frame.itemSpacing = al.spacing;
        if (al.paddingTop !== undefined) frame.paddingTop = al.paddingTop;
        if (al.paddingRight !== undefined) frame.paddingRight = al.paddingRight;
        if (al.paddingBottom !== undefined) frame.paddingBottom = al.paddingBottom;
        if (al.paddingLeft !== undefined) frame.paddingLeft = al.paddingLeft;
        if (al.primaryAxisAlignItems) frame.primaryAxisAlignItems = al.primaryAxisAlignItems;
        if (al.counterAxisAlignItems) frame.counterAxisAlignItems = al.counterAxisAlignItems;
        if (al.primaryAxisSizingMode) frame.primaryAxisSizingMode = al.primaryAxisSizingMode;
        if (al.counterAxisSizingMode) frame.counterAxisSizingMode = al.counterAxisSizingMode;
        if (al.layoutWrap) frame.layoutWrap = al.layoutWrap;
      }
      parent.appendChild(frame);
      return nodeResult(frame);
    }

    case "create_component": {
      const comp = figma.createComponent();
      comp.name = p.name ?? "Component";
      comp.resize(p.width ?? 100, p.height ?? 100);
      comp.x = p.x ?? 0;
      comp.y = p.y ?? 0;
      parent.appendChild(comp);
      return nodeResult(comp);
    }

    case "add_rectangle": {
      const rect = figma.createRectangle();
      rect.name = p.name ?? "Rectangle";
      rect.resize(p.width ?? 100, p.height ?? 100);
      rect.x = p.x ?? 0;
      rect.y = p.y ?? 0;
      if (p.cornerRadius !== undefined) {
        rect.cornerRadius = p.cornerRadius;
      }
      applyFills(rect, p.fills);
      parent.appendChild(rect);
      return nodeResult(rect);
    }

    case "add_ellipse": {
      const ellipse = figma.createEllipse();
      ellipse.name = p.name ?? "Ellipse";
      ellipse.resize(p.width ?? 100, p.height ?? 100);
      ellipse.x = p.x ?? 0;
      ellipse.y = p.y ?? 0;
      applyFills(ellipse, p.fills);
      parent.appendChild(ellipse);
      return nodeResult(ellipse);
    }

    case "add_text": {
      const text = figma.createText();
      const family = p.fontFamily ?? "Inter";
      const style = p.fontWeight ?? "Regular";
      await figma.loadFontAsync({ family, style });
      text.fontName = { family, style };
      text.characters = p.content ?? "";
      text.fontSize = p.fontSize ?? 16;
      text.name = p.name ?? p.content?.substring(0, 20) ?? "Text";
      text.x = p.x ?? 0;
      text.y = p.y ?? 0;
      if (p.width) {
        text.resize(p.width, text.height);
        text.textAutoResize = "HEIGHT";
      }
      applyFills(text, p.fills);
      parent.appendChild(text);
      return nodeResult(text);
    }

    case "add_shape": {
      let shape: SceneNode;
      if (p.shapeType === "LINE") {
        const line = figma.createLine();
        line.resize(p.width ?? 100, 0);
        line.x = p.x ?? 0;
        line.y = p.y ?? 0;
        line.name = p.name ?? "Line";
        parent.appendChild(line);
        shape = line;
      } else {
        const polygon = figma.createPolygon();
        polygon.name = p.name ?? p.shapeType ?? "Polygon";
        polygon.resize(p.width ?? 100, p.height ?? 100);
        polygon.x = p.x ?? 0;
        polygon.y = p.y ?? 0;
        if (p.pointCount) polygon.pointCount = p.pointCount;
        if (p.shapeType === "STAR") {
          // Use a star polygon with inner radius ratio
          const star = figma.createStar();
          star.name = p.name ?? "Star";
          star.resize(p.width ?? 100, p.height ?? 100);
          star.x = p.x ?? 0;
          star.y = p.y ?? 0;
          if (p.pointCount) star.pointCount = p.pointCount;
          applyFills(star, p.fills);
          parent.appendChild(star);
          polygon.remove();
          return nodeResult(star);
        }
        applyFills(polygon, p.fills);
        parent.appendChild(polygon);
        shape = polygon;
      }
      return nodeResult(shape);
    }

    default:
      throw new Error(`Unknown creation command: ${command}`);
  }
}
