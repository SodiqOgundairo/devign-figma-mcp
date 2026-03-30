export async function handleStyling(command: string, params: Record<string, unknown>) {
  const p = params as any;

  if (command === "list_styles") {
    return handleListStyles(p);
  }

  if (command === "apply_style") {
    return handleApplyStyle(p);
  }

  // set_styles
  const node = figma.getNodeById(p.nodeId);
  if (!node) throw new Error(`Node not found: ${p.nodeId}`);

  const scene = node as SceneNode;

  // Fills
  if (p.fills && "fills" in scene) {
    const geo = scene as GeometryMixin;
    geo.fills = p.fills.map((f: any) => ({
      type: f.type ?? "SOLID",
      color: f.color ? { r: f.color.r, g: f.color.g, b: f.color.b } : { r: 0, g: 0, b: 0 },
      opacity: f.opacity ?? 1,
      visible: f.visible ?? true,
    }));
  }

  // Strokes
  if (p.strokes && "strokes" in scene) {
    const geo = scene as GeometryMixin;
    geo.strokes = p.strokes.map((s: any) => ({
      type: "SOLID" as const,
      color: { r: s.color.r, g: s.color.g, b: s.color.b },
      opacity: s.opacity ?? 1,
    }));
  }

  if (p.strokeWeight !== undefined && "strokeWeight" in scene) {
    (scene as GeometryMixin).strokeWeight = p.strokeWeight;
  }

  // Opacity
  if (p.opacity !== undefined) {
    scene.opacity = p.opacity;
  }

  // Corner radius
  if (p.cornerRadius !== undefined && "cornerRadius" in scene) {
    (scene as RectangleNode).cornerRadius = p.cornerRadius;
  }

  // Typography (text nodes only)
  if (scene.type === "TEXT") {
    const text = scene as TextNode;
    const family = p.fontFamily ?? (text.fontName as FontName).family;
    const style = p.fontWeight ?? (text.fontName as FontName).style;
    await figma.loadFontAsync({ family, style });
    text.fontName = { family, style };

    if (p.fontSize !== undefined) text.fontSize = p.fontSize;
    if (p.letterSpacing !== undefined) text.letterSpacing = { value: p.letterSpacing, unit: "PIXELS" };
    if (p.lineHeight !== undefined) text.lineHeight = { value: p.lineHeight, unit: "PIXELS" };
    if (p.textAlignHorizontal) text.textAlignHorizontal = p.textAlignHorizontal;
    if (p.textAlignVertical) text.textAlignVertical = p.textAlignVertical;
  }

  // Effects
  if (p.effects && "effects" in scene) {
    (scene as any).effects = p.effects.map((e: any) => ({
      type: e.type,
      visible: e.visible ?? true,
      radius: e.radius ?? 0,
      color: e.color ? { r: e.color.r, g: e.color.g, b: e.color.b, a: e.color.a ?? 1 } : undefined,
      offset: e.offset ?? { x: 0, y: 0 },
      spread: e.spread ?? 0,
    }));
  }

  return { success: true, nodeId: p.nodeId };
}

function handleListStyles(p: any) {
  const styles: Array<{ id: string; name: string; type: string; description: string; key: string }> = [];

  if (!p.styleType || p.styleType === "PAINT") {
    for (const s of figma.getLocalPaintStyles()) {
      styles.push({ id: s.id, name: s.name, type: "PAINT", description: s.description, key: s.key });
    }
  }
  if (!p.styleType || p.styleType === "TEXT") {
    for (const s of figma.getLocalTextStyles()) {
      styles.push({ id: s.id, name: s.name, type: "TEXT", description: s.description, key: s.key });
    }
  }
  if (!p.styleType || p.styleType === "EFFECT") {
    for (const s of figma.getLocalEffectStyles()) {
      styles.push({ id: s.id, name: s.name, type: "EFFECT", description: s.description, key: s.key });
    }
  }
  if (!p.styleType || p.styleType === "GRID") {
    for (const s of figma.getLocalGridStyles()) {
      styles.push({ id: s.id, name: s.name, type: "GRID", description: s.description, key: s.key });
    }
  }

  return { styles };
}

function handleApplyStyle(p: any) {
  const node = figma.getNodeById(p.nodeId);
  if (!node) throw new Error(`Node not found: ${p.nodeId}`);

  const style = figma.getStyleById(p.styleId);
  if (!style) throw new Error(`Style not found: ${p.styleId}`);

  const scene = node as SceneNode;
  const styleType = style.type;

  if (styleType === "PAINT") {
    const prop = p.property ?? "fill";
    if (prop === "fill" && "fillStyleId" in scene) {
      (scene as any).fillStyleId = p.styleId;
    } else if (prop === "stroke" && "strokeStyleId" in scene) {
      (scene as any).strokeStyleId = p.styleId;
    } else {
      throw new Error(`Cannot apply paint style as "${prop}" on this node`);
    }
  } else if (styleType === "TEXT") {
    if (scene.type !== "TEXT") throw new Error("Text styles can only be applied to text nodes");
    (scene as TextNode).textStyleId = p.styleId;
  } else if (styleType === "EFFECT") {
    if (!("effectStyleId" in scene)) throw new Error("This node does not support effect styles");
    (scene as any).effectStyleId = p.styleId;
  } else if (styleType === "GRID") {
    if (!("gridStyleId" in scene)) throw new Error("This node does not support grid styles");
    (scene as any).gridStyleId = p.styleId;
  } else {
    throw new Error(`Unsupported style type: ${styleType}`);
  }

  return { success: true, nodeId: p.nodeId, styleId: p.styleId, styleType };
}
