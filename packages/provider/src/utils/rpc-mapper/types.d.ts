/**
 * Type for the method handler.
 * It is basically a function that takes an array of parameters and returns a promise.
 */
type MethodHandlerType<TParams, TReturnType> = (
    params: TParams[]
) => Promise<TReturnType>;

export { type MethodHandlerType };
