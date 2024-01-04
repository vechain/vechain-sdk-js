import {
    type BlockDetail,
    type ThorClient
} from '@vechainfoundation/vechain-sdk-network';
import { type MethodHandlerType } from '../types';
import { RPC_METHODS } from '../../const/rpc-mapper';

/**
 * All RPC methods related to blocks
 *
 * @param thorClient - The
 */
const BlocksMap = (
    thorClient: ThorClient
): Record<string, MethodHandlerType<unknown, unknown>> => {
    return {
        /**
         * Returns the block with the given block number.
         *
         * @NOTE IT IS A SIMPLE IMPLEMENTATION TO SET SKELETON! Checks must be done!
         *
         * @param blockNumber - The block number.
         */
        [RPC_METHODS.eth_getBlockByNumber]: async (
            blockNumber
        ): Promise<BlockDetail | null> => {
            return await thorClient.blocks.getBlock(
                blockNumber[0] as string | number
            );
        }

        /**
         * ... Other RPC methods related to blocks ...
         */
        // ...
    };
};

export { BlocksMap };
