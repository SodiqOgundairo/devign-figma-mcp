export async function handleLayout(params: Record<string, unknown>) {
  const p = params as any;
  const node = figma.getNodeById(p.nodeId);
  if (!node) throw new Error(`Node not found: ${p.nodeId}`);
  if (node.type !== "FRAME" && node.type !== "COMPONENT") {
    throw new Error(`Auto-layout can only be applied to frames or components, got ${node.type}`);
  }

  const frame = node as FrameNode;

  frame.layoutMode = p.direction; // "HORIZONTAL" | "VERTICAL"
  frame.itemSpacing = p.spacing ?? 0;
  frame.paddingTop = p.paddingTop ?? 0;
  frame.paddingRight = p.paddingRight ?? 0;
  frame.paddingBottom = p.paddingBottom ?? 0;
  frame.paddingLeft = p.paddingLeft ?? 0;

  if (p.primaryAxisAlignItems) frame.primaryAxisAlignItems = p.primaryAxisAlignItems;
  if (p.counterAxisAlignItems) frame.counterAxisAlignItems = p.counterAxisAlignItems;
  if (p.primaryAxisSizingMode) frame.primaryAxisSizingMode = p.primaryAxisSizingMode;
  if (p.counterAxisSizingMode) frame.counterAxisSizingMode = p.counterAxisSizingMode;

  // Wrap support
  if (p.layoutWrap) frame.layoutWrap = p.layoutWrap;
  if (p.counterAxisSpacing !== undefined) frame.counterAxisSpacing = p.counterAxisSpacing;
  if (p.counterAxisAlignContent) frame.counterAxisAlignContent = p.counterAxisAlignContent;

  // Min/max sizing
  if (p.minWidth !== undefined) frame.minWidth = p.minWidth;
  if (p.maxWidth !== undefined) frame.maxWidth = p.maxWidth;
  if (p.minHeight !== undefined) frame.minHeight = p.minHeight;
  if (p.maxHeight !== undefined) frame.maxHeight = p.maxHeight;

  return { success: true, nodeId: p.nodeId, layoutMode: frame.layoutMode };
}
