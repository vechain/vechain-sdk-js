import { type BytesLike } from '../abi/types.d';

/**
 * Input to hash function.
 */
type HashInput = BytesLike;

type ReturnType = 'buffer' | 'hex';

export { type HashInput, type ReturnType };
