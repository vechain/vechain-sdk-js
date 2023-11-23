import { type BytesLike } from 'ethers';

/**
 * Input to hash function.
 */
type HashInput = BytesLike;

type ReturnType = 'buffer' | 'hex';

export { type HashInput, type ReturnType };
