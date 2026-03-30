import type { CommandType } from "./types.js";
export interface WsBridge {
    send(command: CommandType, params: Record<string, unknown>): Promise<unknown>;
    isConnected(): boolean;
    close(): void;
}
export declare function createWsBridge(options: {
    port: number;
    timeout?: number;
}): WsBridge;
//# sourceMappingURL=ws-bridge.d.ts.map