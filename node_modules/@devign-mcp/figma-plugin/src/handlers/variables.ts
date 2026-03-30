export async function handleVariables(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    case "list_variables": {
      const collections = figma.variables.getLocalVariableCollections();
      const results = collections
        .filter((c) => !p.collectionName || c.name.toLowerCase().includes(p.collectionName.toLowerCase()))
        .map((collection) => {
          const variables = collection.variableIds.map((id) => {
            const variable = figma.variables.getVariableById(id);
            if (!variable) return null;
            return {
              id: variable.id,
              name: variable.name,
              resolvedType: variable.resolvedType,
              valuesByMode: Object.fromEntries(
                Object.entries(variable.valuesByMode).map(([modeId, value]) => {
                  const mode = collection.modes.find((m) => m.modeId === modeId);
                  return [mode?.name ?? modeId, value];
                })
              ),
            };
          }).filter(Boolean);

          return {
            collectionId: collection.id,
            collectionName: collection.name,
            modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
            variables,
          };
        });

      return { collections: results };
    }

    case "bind_variable": {
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);

      const variable = figma.variables.getVariableById(p.variableId);
      if (!variable) throw new Error(`Variable not found: ${p.variableId}`);

      const scene = node as SceneNode;

      // Handle fill/stroke bindings differently — they use paint-level binding
      if (p.field === "fills" && "fills" in scene) {
        const fills = (scene as GeometryMixin).fills as Paint[];
        if (fills.length === 0) throw new Error("Node has no fills to bind variable to");
        const newFills = [...fills];
        newFills[0] = figma.variables.setBoundVariableForPaint(newFills[0], "color", variable);
        (scene as GeometryMixin).fills = newFills;
      } else if (p.field === "strokes" && "strokes" in scene) {
        const strokes = (scene as GeometryMixin).strokes as Paint[];
        if (strokes.length === 0) throw new Error("Node has no strokes to bind variable to");
        const newStrokes = [...strokes];
        newStrokes[0] = figma.variables.setBoundVariableForPaint(newStrokes[0], "color", variable);
        (scene as GeometryMixin).strokes = newStrokes;
      } else {
        // Direct node property binding
        (scene as any).setBoundVariable(p.field, variable);
      }

      return { success: true, nodeId: p.nodeId, variableId: p.variableId, field: p.field };
    }

    default:
      throw new Error(`Unknown variables command: ${command}`);
  }
}
