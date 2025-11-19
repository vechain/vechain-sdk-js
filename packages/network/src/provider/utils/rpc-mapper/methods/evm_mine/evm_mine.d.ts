import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method evm_mine implementation
 *
 * @link [evm_mine](https://hardhat.org/hardhat-network/docs/explanation/mining-modes)
 *
 * @param thorClient - The thor client instance to use.
 * @returns The new block or null if the block is not available.
 * @throws {JSONRPCInternalError}
 */
declare const evmMine: (thorClient: ThorClient) => Promise<null>;
export { evmMine };
//# sourceMappingURL=evm_mine.d.ts.map