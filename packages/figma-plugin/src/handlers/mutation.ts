export async function handleMutation(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    case "edit_node": {
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      const scene = node as SceneNode;

      if (p.name !== undefined) scene.name = p.name;
      if (p.x !== undefined) scene.x = p.x;
      if (p.y !== undefined) scene.y = p.y;
      if (p.visible !== undefined) scene.visible = p.visible;
      if (p.locked !== undefined) scene.locked = p.locked;
      if (p.rotation !== undefined) scene.rotation = p.rotation;

      if (p.width !== undefined || p.height !== undefined) {
        const w = p.width ?? scene.width;
        const h = p.height ?? scene.height;
        if ("resize" in scene) {
          (scene as any).resize(w, h);
        }
      }

      if (p.characters !== undefined && scene.type === "TEXT") {
        const text = scene as TextNode;
        const fontName = text.fontName as FontName;
        await figma.loadFontAsync(fontName);
        text.characters = p.characters;
      }

      // Blend mode
      if (p.blendMode !== undefined && "blendMode" in scene) {
        (scene as any).blendMode = p.blendMode;
      }

      // Constraints (non-auto-layout positioning)
      if (p.constraints !== undefined && "constraints" in scene) {
        (scene as any).constraints = p.constraints;
      }

      // Auto-layout child properties
      if (p.layoutAlign !== undefined) (scene as any).layoutAlign = p.layoutAlign;
      if (p.layoutGrow !== undefined) (scene as any).layoutGrow = p.layoutGrow;
      if (p.layoutSizingHorizontal !== undefined) (scene as any).layoutSizingHorizontal = p.layoutSizingHorizontal;
      if (p.layoutSizingVertical !== undefined) (scene as any).layoutSizingVertical = p.layoutSizingVertical;
      if (p.layoutPositioning !== undefined) (scene as any).layoutPositioning = p.layoutPositioning;

      return { success: true, nodeId: p.nodeId };
    }

    case "delete_node": {
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      (node as SceneNode).remove();
      return { success: true, deleted: p.nodeId };
    }

    default:
      throw new Error(`Unknown mutation command: ${command}`);
  }
}
