// Create a new module in a separate file, e.g., net.ts

export interface Net {
    /** base URL */
    readonly baseURL: string;
    /**
     * perform http request
     * @param method 'GET' or 'POST'
     * @param path path to access
     * @param params additional params
     * @returns response body, JSON decoded
     */
    http: (
        method: 'GET' | 'POST',
        path: string,
        params?: Net.Params
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => Promise<any>;
    /**
     * open websocket reader on path
     * @param path
     */
    openWebSocketReader: (path: string) => Net.WebSocketReader;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace Net {
    /** http request params */
    interface Params {
        query?: Record<string, string>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body?: any;
        headers?: Record<string, string>;
        validateResponseHeader?: (headers: Record<string, string>) => void;
    }
    /** websocket reader */
    interface WebSocketReader {
        /** read data */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        read: () => Promise<any>;
        close: () => void;
    }
}
