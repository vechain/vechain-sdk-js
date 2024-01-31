import { type BlocksRPC } from '../../provider';

/**
 * Type for the method handler.
 * It is basically a function that takes an array of parameters and returns a promise.
 */
type MethodHandlerType<TParams, TReturnType> = (
    params: TParams[]
) => Promise<TReturnType>;

/**
 * Return type for the RPC Method eth_syncing implementation
 */
interface SyncBlock {
    startingBlock: null;
    currentBlock: BlocksRPC | null;
    highestBlock: string | null;
}

export { type MethodHandlerType, type SyncBlock };
