import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_getCode implementation
 *
 * @link [eth_getCode](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note Only 'latest' and 'finalized' block numbers are supported.
 *
 * @param thorClient - ThorClient instance.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The address to get the code for as a hex string.
 *               * params[1]: The block number to get the code at as a hex string or "latest".
 * @returns The code of the account at the given address formatted to the RPC standard.
 * @throws {JSONRPCInternalError}
 */
declare const ethGetCode: (thorClient: ThorClient, params: unknown[]) => Promise<string>;
export { ethGetCode };
//# sourceMappingURL=eth_getCode.d.ts.map