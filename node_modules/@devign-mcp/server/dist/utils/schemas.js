import { z } from "zod";
const colorSchema = z.object({
    r: z.number().min(0).max(1),
    g: z.number().min(0).max(1),
    b: z.number().min(0).max(1),
});
const gradientStopSchema = z.object({
    position: z.number().min(0).max(1).describe("Stop position from 0 to 1"),
    color: colorSchema.extend({ a: z.number().min(0).max(1).default(1) }),
});
export const fillSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("SOLID"),
        color: colorSchema,
        opacity: z.number().min(0).max(1).optional(),
        visible: z.boolean().optional(),
    }),
    z.object({
        type: z.literal("GRADIENT_LINEAR"),
        gradientStops: z.array(gradientStopSchema).min(2),
        gradientTransform: z.array(z.array(z.number())).optional()
            .describe("2x3 affine transform matrix [[a,b,tx],[c,d,ty]]"),
        opacity: z.number().min(0).max(1).optional(),
        visible: z.boolean().optional(),
    }),
    z.object({
        type: z.literal("GRADIENT_RADIAL"),
        gradientStops: z.array(gradientStopSchema).min(2),
        gradientTransform: z.array(z.array(z.number())).optional(),
        opacity: z.number().min(0).max(1).optional(),
        visible: z.boolean().optional(),
    }),
    z.object({
        type: z.literal("GRADIENT_ANGULAR"),
        gradientStops: z.array(gradientStopSchema).min(2),
        gradientTransform: z.array(z.array(z.number())).optional(),
        opacity: z.number().min(0).max(1).optional(),
        visible: z.boolean().optional(),
    }),
    z.object({
        type: z.literal("GRADIENT_DIAMOND"),
        gradientStops: z.array(gradientStopSchema).min(2),
        gradientTransform: z.array(z.array(z.number())).optional(),
        opacity: z.number().min(0).max(1).optional(),
        visible: z.boolean().optional(),
    }),
    z.object({
        type: z.literal("IMAGE"),
        imageUrl: z.string().optional().describe("URL to fetch and set as image fill"),
        scaleMode: z.enum(["FILL", "FIT", "CROP", "TILE"]).optional().default("FILL"),
        opacity: z.number().min(0).max(1).optional(),
        visible: z.boolean().optional(),
    }),
]);
export const strokeSchema = z.object({
    color: colorSchema,
    weight: z.number().positive().optional(),
    opacity: z.number().min(0).max(1).optional(),
});
export const effectSchema = z.object({
    type: z.enum(["DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR", "BACKGROUND_BLUR"]),
    visible: z.boolean().default(true),
    radius: z.number().min(0).optional(),
    color: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
        a: z.number().min(0).max(1).default(1),
    }).optional(),
    offset: z.object({ x: z.number(), y: z.number() }).optional(),
    spread: z.number().optional(),
});
//# sourceMappingURL=schemas.js.map