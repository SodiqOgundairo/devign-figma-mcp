import { z } from "zod";
export declare const fillSchema: z.ZodObject<{
    type: z.ZodDefault<z.ZodEnum<["SOLID", "GRADIENT_LINEAR", "GRADIENT_RADIAL", "IMAGE"]>>;
    color: z.ZodOptional<z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
    }, {
        r: number;
        g: number;
        b: number;
    }>>;
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "IMAGE";
    color?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
    opacity?: number | undefined;
    visible?: boolean | undefined;
}, {
    type?: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "IMAGE" | undefined;
    color?: {
        r: number;
        g: number;
        b: number;
    } | undefined;
    opacity?: number | undefined;
    visible?: boolean | undefined;
}>;
export declare const strokeSchema: z.ZodObject<{
    color: z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
    }, {
        r: number;
        g: number;
        b: number;
    }>;
    weight: z.ZodOptional<z.ZodNumber>;
    opacity: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    color: {
        r: number;
        g: number;
        b: number;
    };
    opacity?: number | undefined;
    weight?: number | undefined;
}, {
    color: {
        r: number;
        g: number;
        b: number;
    };
    opacity?: number | undefined;
    weight?: number | undefined;
}>;
export declare const positionSchema: z.ZodObject<{
    x: z.ZodDefault<z.ZodNumber>;
    y: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x?: number | undefined;
    y?: number | undefined;
}>;
export declare const parentSchema: z.ZodObject<{
    parentId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    parentId?: string | undefined;
}, {
    parentId?: string | undefined;
}>;
//# sourceMappingURL=schemas.d.ts.map