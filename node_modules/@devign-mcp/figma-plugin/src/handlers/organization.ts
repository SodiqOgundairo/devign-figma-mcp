export async function handleOrganization(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    case "group_nodes": {
      const nodes: SceneNode[] = [];
      for (const id of p.nodeIds) {
        const node = figma.getNodeById(id);
        if (!node) throw new Error(`Node not found: ${id}`);
        nodes.push(node as SceneNode);
      }
      if (nodes.length === 0) throw new Error("No nodes to group");

      const group = figma.group(nodes, nodes[0].parent as BaseNode & ChildrenMixin);
      group.name = p.name ?? "Group";
      return { nodeId: group.id, name: group.name };
    }

    case "flatten_node": {
      const node = figma.getNodeById(p.nodeId);
      if (!node) throw new Error(`Node not found: ${p.nodeId}`);
      const flat = figma.flatten([node as SceneNode]);
      return { nodeId: flat.id, name: flat.name };
    }

    case "create_page": {
      const page = figma.createPage();
      page.name = p.name ?? "New Page";
      return { pageId: page.id, name: page.name };
    }

    default:
      throw new Error(`Unknown organization command: ${command}`);
  }
}
