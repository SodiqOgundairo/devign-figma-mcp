import { z } from "zod";

export const fillSchema = z.object({
  type: z.enum(["SOLID", "GRADIENT_LINEAR", "GRADIENT_RADIAL", "IMAGE"]).default("SOLID"),
  color: z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
  }).optional(),
  opacity: z.number().min(0).max(1).optional(),
  visible: z.boolean().optional(),
});

export const strokeSchema = z.object({
  color: z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
  }),
  weight: z.number().positive().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

export const positionSchema = z.object({
  x: z.number().default(0).describe("X position"),
  y: z.number().default(0).describe("Y position"),
});

export const parentSchema = z.object({
  parentId: z.string().optional().describe("Parent node ID; defaults to current page"),
});
