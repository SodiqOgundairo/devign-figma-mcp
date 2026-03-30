import type { WsBridge } from "../ws-bridge.js";
export declare function ensureConnected(bridge: WsBridge): void;
export declare function toolResult(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function toolError(message: string): {
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
};
//# sourceMappingURL=errors.d.ts.map