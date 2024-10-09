/**
 * Default Object error data type. it accepts any object.
 */
type ObjectErrorData = Record<string, unknown>;
type JSONRpcErrorCode = -32700 | -32600 | -32601 | -32602 | -32603 | -32000;

export type { ObjectErrorData, JSONRpcErrorCode };
