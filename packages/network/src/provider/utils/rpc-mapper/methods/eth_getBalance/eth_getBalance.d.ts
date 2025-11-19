import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_getBalance implementation
 *
 * @link [eth_getBalance](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: The address to get the balance for as a hex string.
 *                * params[1]: The block number to get the balance at as a hex string or "latest".
 * @returns the balance of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetBalance: (thorClient: ThorClient, params: unknown[]) => Promise<string>;
export { ethGetBalance };
//# sourceMappingURL=eth_getBalance.d.ts.map