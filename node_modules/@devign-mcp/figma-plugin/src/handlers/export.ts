export async function handleExport(params: Record<string, unknown>) {
  const p = params as any;
  const node = figma.getNodeById(p.nodeId);
  if (!node) throw new Error(`Node not found: ${p.nodeId}`);

  const scene = node as SceneNode;

  if (!("exportAsync" in scene)) {
    throw new Error(`Node ${p.nodeId} does not support export`);
  }

  const format = p.format ?? "PNG";
  const scale = p.scale ?? 1;

  const bytes = await (scene as any).exportAsync({
    format,
    ...(format !== "SVG" ? { constraint: { type: "SCALE", value: scale } } : {}),
  });

  // Convert Uint8Array to base64
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const mimeTypes: Record<string, string> = {
    PNG: "image/png",
    JPG: "image/jpeg",
    SVG: "image/svg+xml",
    PDF: "application/pdf",
  };

  return {
    base64,
    format,
    mimeType: mimeTypes[format] ?? "application/octet-stream",
    size: bytes.length,
  };
}
