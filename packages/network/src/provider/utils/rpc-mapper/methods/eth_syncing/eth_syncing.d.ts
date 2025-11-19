import { type ThorClient } from '../../../../../thor-client';
import { type SyncBlockRPC } from '../../../formatter';
/**
 * RPC Method eth_syncing implementation
 *
 * @link [eth_syncing](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 *
 * @note The startingBlock parameter is not supported.
 *
 * @returns Returns an object with the sync status of the node if the node is out-of-sync and is syncing. Returns false when the node is already in sync.
 */
declare const ethSyncing: (thorClient: ThorClient) => Promise<boolean | SyncBlockRPC>;
export { ethSyncing };
//# sourceMappingURL=eth_syncing.d.ts.map