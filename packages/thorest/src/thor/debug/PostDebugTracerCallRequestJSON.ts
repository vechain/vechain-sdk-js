/**
 * [PostDebugTracerCallRe](http://localhost:8669/doc/stoplight-ui/#/schemas/PostDebugTracerCallRequest)
 */
interface PostDebugTracerCallRequestJSON {
    name?: string; // string or null
    config?: unknown; // object or null
    value: string; // hex
    data: string; // hex
    to?: string; // address
    gas?: number; // integer or null
    gasPrice?: string; // hex or null
    caller?: string; // address or null
    provedWork?: string; // numeric string or null
    gasPayer?: string; // address
    expiration?: number; // integer or null
    blockRef?: string; // hex
}

export { type PostDebugTracerCallRequestJSON };
