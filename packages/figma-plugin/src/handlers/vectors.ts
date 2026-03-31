function getParent(parentId?: string): BaseNode & ChildrenMixin {
  if (parentId) {
    const node = figma.getNodeById(parentId);
    if (!node) throw new Error(`Parent node not found: ${parentId}`);
    if (!("children" in node)) throw new Error(`Node ${parentId} cannot have children`);
    return node as BaseNode & ChildrenMixin;
  }
  return figma.currentPage;
}

export async function handleVectors(command: string, params: Record<string, unknown>) {
  const p = params as any;

  switch (command) {
    case "create_vector": {
      const vector = figma.createVector();
      vector.name = p.name ?? "Vector";
      vector.x = p.x ?? 0;
      vector.y = p.y ?? 0;

      // Set vector paths
      vector.vectorPaths = (p.paths as any[]).map((path: any) => ({
        data: path.data,
        windingRule: path.windingRule ?? "NONZERO",
      }));

      // Optionally resize to desired dimensions
      if (p.width && p.height) {
        vector.resize(p.width, p.height);
      }

      // Apply fills
      if (p.fills && p.fills.length > 0) {
        vector.fills = p.fills.map((f: any) => {
          if (f.type === "SOLID" && f.color) {
            return {
              type: "SOLID",
              color: { r: f.color.r, g: f.color.g, b: f.color.b },
              opacity: f.opacity ?? 1,
            };
          }
          return { type: "SOLID", color: { r: 0, g: 0, b: 0 } };
        });
      }

      const parent = getParent(p.parentId);
      parent.appendChild(vector);

      return { nodeId: vector.id, name: vector.name, type: vector.type };
    }

    case "create_from_svg": {
      const svgNode = figma.createNodeFromSvg(p.svg);
      svgNode.x = p.x ?? 0;
      svgNode.y = p.y ?? 0;
      if (p.name) svgNode.name = p.name;

      if (p.parentId) {
        const parent = getParent(p.parentId);
        parent.appendChild(svgNode);
      }

      return { nodeId: svgNode.id, name: svgNode.name, type: svgNode.type };
    }

    case "boolean_operation": {
      const nodes: SceneNode[] = [];
      for (const id of p.nodeIds) {
        const node = figma.getNodeById(id);
        if (!node) throw new Error(`Node not found: ${id}`);
        nodes.push(node as SceneNode);
      }
      if (nodes.length < 2) throw new Error("Boolean operations require at least 2 nodes");

      const parentNode = nodes[0].parent as BaseNode & ChildrenMixin;
      let result: BooleanOperationNode;

      switch (p.operation) {
        case "UNION":
          result = figma.union(nodes, parentNode);
          break;
        case "SUBTRACT":
          result = figma.subtract(nodes, parentNode);
          break;
        case "INTERSECT":
          result = figma.intersect(nodes, parentNode);
          break;
        case "EXCLUDE":
          result = figma.exclude(nodes, parentNode);
          break;
        default:
          throw new Error(`Unknown boolean operation: ${p.operation}`);
      }

      if (p.name) result.name = p.name;

      return { nodeId: result.id, name: result.name, type: result.type };
    }

    default:
      throw new Error(`Unknown vector command: ${command}`);
  }
}
