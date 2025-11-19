import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_sendRawTransaction implementation
 *
 * @link [eth_sendrawtransaction](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The signed transaction data as a hex string.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethSendRawTransaction: (thorClient: ThorClient, params: unknown[]) => Promise<string>;
export { ethSendRawTransaction };
//# sourceMappingURL=eth_sendRawTransaction.d.ts.map