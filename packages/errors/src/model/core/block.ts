import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Error to be thrown when the genesis block is not found.
 */
class BlockGenesisNotFound extends ErrorBase<
    BLOCK.GENESIS_BLOCK_NOT_FOUND,
    DefaultErrorData
> {}

class BestBlockNotFound extends ErrorBase<
    BLOCK.BEST_BLOCK_NOT_FOUND,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum BLOCK {
    GENESIS_BLOCK_NOT_FOUND = 'GENESIS_BLOCK_NOT_FOUND',
    BEST_BLOCK_NOT_FOUND = 'BEST_BLOCK_NOT_FOUND'
}

export { BlockGenesisNotFound, BestBlockNotFound, BLOCK };
