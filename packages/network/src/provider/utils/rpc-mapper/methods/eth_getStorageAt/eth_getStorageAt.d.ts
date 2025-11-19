import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_getStorageAt implementation
 *
 * @link [eth_getStorageAt](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the storage slot for as a hex string.
 *               * params[1]: The storage position to get as a hex string.
 *               * params[2]: The block number to get the storage slot at as a hex string or "latest".
 * @returns The storage slot of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetStorageAt: (thorClient: ThorClient, params: unknown[]) => Promise<string>;
export { ethGetStorageAt };
//# sourceMappingURL=eth_getStorageAt.d.ts.map