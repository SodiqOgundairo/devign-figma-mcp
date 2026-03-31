export async function handleDesignSystem(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    // ── Variable Creation ──

    case "create_variable_collection": {
      const collection = figma.variables.createVariableCollection(p.name);

      // Rename the default first mode if modes are provided
      if (p.modes && p.modes.length > 0) {
        collection.renameMode(collection.modes[0].modeId, p.modes[0]);
        // Add additional modes
        for (let i = 1; i < p.modes.length; i++) {
          collection.addMode(p.modes[i]);
        }
      }

      return {
        collectionId: collection.id,
        name: collection.name,
        modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
      };
    }

    case "create_variable": {
      const collection = figma.variables.getVariableCollectionById(p.collectionId);
      if (!collection) throw new Error(`Collection not found: ${p.collectionId}`);

      const variable = figma.variables.createVariable(p.name, collection, p.resolvedType);

      // Set values per mode if provided
      if (p.values) {
        for (const [modeName, value] of Object.entries(p.values)) {
          const mode = collection.modes.find((m) => m.name === modeName);
          if (!mode) throw new Error(`Mode not found: ${modeName}`);
          variable.setValueForMode(mode.modeId, value as VariableValue);
        }
      }

      return {
        variableId: variable.id,
        name: variable.name,
        resolvedType: variable.resolvedType,
        collectionId: p.collectionId,
      };
    }

    case "set_variable_value": {
      const variable = figma.variables.getVariableById(p.variableId);
      if (!variable) throw new Error(`Variable not found: ${p.variableId}`);

      const collectionId = variable.variableCollectionId;
      const collection = figma.variables.getVariableCollectionById(collectionId);
      if (!collection) throw new Error(`Collection not found for variable: ${p.variableId}`);

      const mode = collection.modes.find((m) => m.name === p.modeName);
      if (!mode) throw new Error(`Mode not found: ${p.modeName}`);

      variable.setValueForMode(mode.modeId, p.value as VariableValue);

      return { success: true, variableId: p.variableId, modeName: p.modeName };
    }

    // ── Style Creation ──

    case "create_paint_style": {
      const style = figma.createPaintStyle();
      style.name = p.name;
      if (p.description) style.description = p.description;

      style.paints = (p.paints as any[]).map((paint: any) => {
        switch (paint.type) {
          case "SOLID":
            return {
              type: "SOLID",
              color: { r: paint.color?.r ?? 0, g: paint.color?.g ?? 0, b: paint.color?.b ?? 0 },
              opacity: paint.opacity ?? 1,
              visible: paint.visible ?? true,
            } as SolidPaint;

          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND":
            return {
              type: paint.type,
              gradientStops: (paint.gradientStops ?? []).map((s: any) => ({
                position: s.position,
                color: { r: s.color.r, g: s.color.g, b: s.color.b, a: s.color.a ?? 1 },
              })),
              gradientTransform: paint.gradientTransform ?? [[1, 0, 0], [0, 1, 0]],
              opacity: paint.opacity ?? 1,
              visible: paint.visible ?? true,
            } as GradientPaint;

          default:
            return { type: "SOLID", color: { r: 0, g: 0, b: 0 } } as SolidPaint;
        }
      });

      return { styleId: style.id, name: style.name, key: style.key };
    }

    case "create_text_style": {
      const style = figma.createTextStyle();
      style.name = p.name;
      if (p.description) style.description = p.description;

      const family = p.fontFamily ?? "Inter";
      const weight = p.fontWeight ?? "Regular";
      await figma.loadFontAsync({ family, style: weight });

      style.fontName = { family, style: weight };
      style.fontSize = p.fontSize;

      if (p.lineHeight !== undefined) {
        style.lineHeight = { value: p.lineHeight, unit: "PIXELS" };
      }
      if (p.letterSpacing !== undefined) {
        style.letterSpacing = { value: p.letterSpacing, unit: "PIXELS" };
      }
      if (p.textAlignHorizontal) {
        // Text styles don't have textAlignHorizontal directly, it's on the node
        // But we can set paragraph properties
      }

      return { styleId: style.id, name: style.name, key: style.key };
    }

    case "create_effect_style": {
      const style = figma.createEffectStyle();
      style.name = p.name;
      if (p.description) style.description = p.description;

      style.effects = (p.effects as any[]).map((e: any) => ({
        type: e.type,
        visible: e.visible ?? true,
        radius: e.radius ?? 0,
        color: e.color
          ? { r: e.color.r, g: e.color.g, b: e.color.b, a: e.color.a ?? 1 }
          : { r: 0, g: 0, b: 0, a: 0.25 },
        offset: e.offset ?? { x: 0, y: 0 },
        spread: e.spread ?? 0,
      })) as Effect[];

      return { styleId: style.id, name: style.name, key: style.key };
    }

    // ── Component Variants ──

    case "combine_as_variants": {
      const components: ComponentNode[] = [];
      for (const id of p.componentIds) {
        const node = figma.getNodeById(id);
        if (!node) throw new Error(`Node not found: ${id}`);
        if (node.type !== "COMPONENT") throw new Error(`Node ${id} is not a component (got ${node.type})`);
        components.push(node as ComponentNode);
      }

      const parent = components[0].parent as BaseNode & ChildrenMixin;
      const componentSet = figma.combineAsVariants(components, parent);
      if (p.name) componentSet.name = p.name;

      return {
        nodeId: componentSet.id,
        name: componentSet.name,
        type: componentSet.type,
        variantCount: components.length,
      };
    }

    case "add_component_property": {
      const node = figma.getNodeById(p.componentId);
      if (!node) throw new Error(`Node not found: ${p.componentId}`);
      if (node.type !== "COMPONENT" && node.type !== "COMPONENT_SET") {
        throw new Error(`Node ${p.componentId} is not a component/component set (got ${node.type})`);
      }

      const comp = node as ComponentNode;
      comp.addComponentProperty(p.propertyName, p.propertyType, p.defaultValue);

      return { success: true, componentId: p.componentId, propertyName: p.propertyName };
    }

    default:
      throw new Error(`Unknown design system command: ${command}`);
  }
}
