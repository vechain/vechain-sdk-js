import type { Hex } from './Hex';

/**
 * Values that can be treated as a Hex value
 *
 * Accepts both strongly-typed `Hex` objects and plain hex strings
 */
type HexLike = Hex | string | `0x${string}`;

export type { HexLike };
