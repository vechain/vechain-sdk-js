/**
 * Type for the method handler.
 * It is basically a function that takes an array of parameters and returns a promise.
 */
type MethodHandlerType<TParams, TReturnType> = (
    params: TParams[]
) => Promise<TReturnType>;

/**
 * Block type for RPC methods.
 *
 * It can be a block hash or a block number or a string ('0x...', 'latest', 'earliest', 'pending').
 */
type BlockQuantityInputRPC =
    | string
    | { blockHash: string; blockNumber: never }
    | { blockHash: never; blockNumber: number };

export { type MethodHandlerType, type BlockQuantityInputRPC };
