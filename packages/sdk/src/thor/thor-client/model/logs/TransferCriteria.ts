import { type AddressLike } from '@common/vcdm';

/**
 * Transfer criteria for filtering transfer logs.
 */
interface TransferCriteria {
    /**
     * The address from which the transaction was sent.
     */
    readonly txOrigin?: AddressLike;

    /**
     * The address that sent the VET.
     */
    readonly sender?: AddressLike;

    /**
     * The address that received the VET.
     */
    readonly recipient?: AddressLike;
}

export type { TransferCriteria };
