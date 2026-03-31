import { z } from "zod";
export declare const fillSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"SOLID">;
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
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "SOLID";
    color: {
        r: number;
        g: number;
        b: number;
    };
    opacity?: number | undefined;
    visible?: boolean | undefined;
}, {
    type: "SOLID";
    color: {
        r: number;
        g: number;
        b: number;
    };
    opacity?: number | undefined;
    visible?: boolean | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"GRADIENT_LINEAR">;
    gradientStops: z.ZodArray<z.ZodObject<{
        position: z.ZodNumber;
        color: z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        } & {
            a: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
            a: number;
        }, {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }>, "many">;
    gradientTransform: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">>;
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "GRADIENT_LINEAR";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}, {
    type: "GRADIENT_LINEAR";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"GRADIENT_RADIAL">;
    gradientStops: z.ZodArray<z.ZodObject<{
        position: z.ZodNumber;
        color: z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        } & {
            a: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
            a: number;
        }, {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }>, "many">;
    gradientTransform: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">>;
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "GRADIENT_RADIAL";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}, {
    type: "GRADIENT_RADIAL";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"GRADIENT_ANGULAR">;
    gradientStops: z.ZodArray<z.ZodObject<{
        position: z.ZodNumber;
        color: z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        } & {
            a: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
            a: number;
        }, {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }>, "many">;
    gradientTransform: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">>;
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "GRADIENT_ANGULAR";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}, {
    type: "GRADIENT_ANGULAR";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"GRADIENT_DIAMOND">;
    gradientStops: z.ZodArray<z.ZodObject<{
        position: z.ZodNumber;
        color: z.ZodObject<{
            r: z.ZodNumber;
            g: z.ZodNumber;
            b: z.ZodNumber;
        } & {
            a: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            r: number;
            g: number;
            b: number;
            a: number;
        }, {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }, {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }>, "many">;
    gradientTransform: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">>;
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "GRADIENT_DIAMOND";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}, {
    type: "GRADIENT_DIAMOND";
    gradientStops: {
        position: number;
        color: {
            r: number;
            g: number;
            b: number;
            a?: number | undefined;
        };
    }[];
    opacity?: number | undefined;
    visible?: boolean | undefined;
    gradientTransform?: number[][] | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"IMAGE">;
    imageUrl: z.ZodOptional<z.ZodString>;
    scaleMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<["FILL", "FIT", "CROP", "TILE"]>>>;
    opacity: z.ZodOptional<z.ZodNumber>;
    visible: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "IMAGE";
    scaleMode: "FILL" | "FIT" | "CROP" | "TILE";
    opacity?: number | undefined;
    visible?: boolean | undefined;
    imageUrl?: string | undefined;
}, {
    type: "IMAGE";
    opacity?: number | undefined;
    visible?: boolean | undefined;
    imageUrl?: string | undefined;
    scaleMode?: "FILL" | "FIT" | "CROP" | "TILE" | undefined;
}>]>;
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
export declare const effectSchema: z.ZodObject<{
    type: z.ZodEnum<["DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR", "BACKGROUND_BLUR"]>;
    visible: z.ZodDefault<z.ZodBoolean>;
    radius: z.ZodOptional<z.ZodNumber>;
    color: z.ZodOptional<z.ZodObject<{
        r: z.ZodNumber;
        g: z.ZodNumber;
        b: z.ZodNumber;
        a: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        r: number;
        g: number;
        b: number;
        a: number;
    }, {
        r: number;
        g: number;
        b: number;
        a?: number | undefined;
    }>>;
    offset: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
    }, {
        x: number;
        y: number;
    }>>;
    spread: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
    visible: boolean;
    color?: {
        r: number;
        g: number;
        b: number;
        a: number;
    } | undefined;
    radius?: number | undefined;
    offset?: {
        x: number;
        y: number;
    } | undefined;
    spread?: number | undefined;
}, {
    type: "DROP_SHADOW" | "INNER_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
    color?: {
        r: number;
        g: number;
        b: number;
        a?: number | undefined;
    } | undefined;
    visible?: boolean | undefined;
    radius?: number | undefined;
    offset?: {
        x: number;
        y: number;
    } | undefined;
    spread?: number | undefined;
}>;
//# sourceMappingURL=schemas.d.ts.map