/**
 * Type for a JSON-RPC request.
 * It is a wrapped JsonRpcRequest of hardhat.
 * you can find the original into "hardhat/types".
 *
 * @note we wrap here the original type to avoid
 * the usage of hardhat dependency for provider package.
 */
interface JsonRpcRequest {
    jsonrpc: string;
    method: string;
    params: unknown[];
    id: number;
}

/**
 * Type for a JSON-RPC response.
 * It is a wrapped JsonRpcResponse of hardhat.
 * you can find the original into "hardhat/types".
 *
 * @note we wrap here the original type to avoid
 * the usage of hardhat dependency for provider package.
 */
interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: unknown;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}

/**
 * Type for hardhat error function callback
 *
 * @note we use this callback to delegate the hardhat import
 * to the final code who will use provider
 */
type BuildHardhatErrorFunction = (message: string, parent?: Error) => Error;

export {
    type JsonRpcRequest,
    type JsonRpcResponse,
    type BuildHardhatErrorFunction
};
