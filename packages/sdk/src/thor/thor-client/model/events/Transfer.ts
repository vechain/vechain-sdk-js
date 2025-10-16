import { type Address } from '@common/vcdm';
import { type TransferResponse } from '@thor/thorest/common';

/**
 * Represents a transfer event of VET between two addresses.
 */
class Transfer {
    /**
     * The address that sent the VET.
     */
    readonly sender: Address;

    /**
     * The address that received the VET.
     */
    readonly recipient: Address;

    /**
     * The amount of VET transferred in wei.
     */
    readonly amount: bigint;

    /**
     * Create a transfer from the given sender, recipient and amount.
     *
     * @param sender - The address that sent the VET.
     * @param recipient - The address that received the VET.
     * @param amount - The amount of VET transferred in wei.
     */
    constructor(sender: Address, recipient: Address, amount: bigint) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
    }

    /**
     * Create a transfer from the given transfer response.
     *
     * @param response - The transfer response to create the transfer from.
     * @returns The transfer.
     */
    static of(response: TransferResponse): Transfer {
        return new Transfer(
            response.sender,
            response.recipient,
            response.amount
        );
    }
}

export { Transfer };
