import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_blockNumber implementation
 *
 * @link [eth_blockNumber](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @returns the latest block number as a hex string. If the block number cannot be retrieved, it will return '0x0'
 * @throws {JSONRPCInternalError}
 */
declare const ethBlockNumber: (thorClient: ThorClient) => Promise<string>;
export { ethBlockNumber };
//# sourceMappingURL=eth_blockNumber.d.ts.map