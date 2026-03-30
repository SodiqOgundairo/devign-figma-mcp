export async function handleComponents(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    case "list_components": {
      const components = figma.currentPage.findAllWithCriteria({ types: ["COMPONENT"] });
      const filtered = p.nameFilter
        ? components.filter((c) => c.name.toLowerCase().includes(p.nameFilter.toLowerCase()))
        : components;

      return {
        components: filtered.map((c) => ({
          id: c.id,
          name: c.name,
          description: (c as ComponentNode).description,
          key: (c as ComponentNode).key,
          width: c.width,
          height: c.height,
        })),
      };
    }

    case "create_instance": {
      const componentNode = figma.getNodeById(p.componentId);
      if (!componentNode) throw new Error(`Component not found: ${p.componentId}`);
      if (componentNode.type !== "COMPONENT") throw new Error(`Node ${p.componentId} is not a component (got ${componentNode.type})`);

      const instance = (componentNode as ComponentNode).createInstance();
      instance.x = p.x ?? 0;
      instance.y = p.y ?? 0;

      if (p.parentId) {
        const parent = figma.getNodeById(p.parentId);
        if (!parent) throw new Error(`Parent node not found: ${p.parentId}`);
        if (!("children" in parent)) throw new Error(`Node ${p.parentId} cannot have children`);
        (parent as BaseNode & ChildrenMixin).appendChild(instance);
      }

      return { nodeId: instance.id, name: instance.name, type: instance.type };
    }

    case "set_overrides": {
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      if (node.type !== "INSTANCE") throw new Error(`Node ${p.nodeId} is not a component instance (got ${node.type})`);

      const instance = node as InstanceNode;
      const props: Record<string, string | number | boolean> = {};
      for (const override of p.overrides) {
        props[override.propertyName] = override.value;
      }
      instance.setProperties(props);

      return { success: true, nodeId: p.nodeId };
    }

    case "swap_component": {
      const instanceNode = figma.getNodeById(p.instanceId);
      if (!instanceNode) throw new Error(`Instance not found: ${p.instanceId}`);
      if (instanceNode.type !== "INSTANCE") throw new Error(`Node ${p.instanceId} is not a component instance (got ${instanceNode.type})`);

      const newComponent = figma.getNodeById(p.newComponentId);
      if (!newComponent) throw new Error(`Component not found: ${p.newComponentId}`);
      if (newComponent.type !== "COMPONENT") throw new Error(`Node ${p.newComponentId} is not a component (got ${newComponent.type})`);

      (instanceNode as InstanceNode).swapComponent(newComponent as ComponentNode);

      return { success: true, instanceId: p.instanceId, newComponentId: p.newComponentId };
    }

    default:
      throw new Error(`Unknown component command: ${command}`);
  }
}
