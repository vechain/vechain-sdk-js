import { Address } from './Address';

/**
 * Values that can be treated as an address throughout the SDK.
 *
 * Accepts both strongly-typed `Address` objects and plain hex strings so that
 * developer ergonomics match familiar viem/ethers patterns while internally
 * retaining strict validation when we normalize inputs.
 */
type AddressLike = Address | string | `0x${string}`;

export type { AddressLike };
