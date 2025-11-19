import { type CompressedBlockDetail, type ExpandedBlockDetail } from '../../../../thor-client';
import { type BlocksRPC } from './types';
/**
 * Output formatter for block details.
 * It converts the block details into the RPC standard.
 *
 * @param block - The block details to be formatted.
 * @param chainId - The chain id to use for the transaction formatting.
 */
declare const formatToRPCStandard: (block: CompressedBlockDetail | ExpandedBlockDetail, chainId: string) => BlocksRPC;
export { formatToRPCStandard };
//# sourceMappingURL=formatter.d.ts.map