import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_chainId implementation
 *
 * @link [eth_chainId](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - ThorClient instance.
 * @returns Returns the block id of the genesis block.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethChainId: (thorClient: ThorClient) => Promise<string>;
declare const getCachedChainId: (thorClient: ThorClient) => Promise<string>;
declare const getCachedChainTag: (thorClient: ThorClient) => Promise<string>;
export { ethChainId, getCachedChainId, getCachedChainTag };
//# sourceMappingURL=eth_chainId.d.ts.map