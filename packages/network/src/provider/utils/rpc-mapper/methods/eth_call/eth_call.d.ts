import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_call implementation
 *
 * @link [eth_call](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 * @returns The return value of executed contract.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethCall: (thorClient: ThorClient, params: unknown[]) => Promise<string>;
export { ethCall };
//# sourceMappingURL=eth_call.d.ts.map