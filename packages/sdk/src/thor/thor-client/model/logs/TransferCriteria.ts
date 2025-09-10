import { type Address } from '@common/vcdm';

class TransferCriteria {
    /**
     * The address from which the transaction was sent.
     */
    readonly txOrigin: Address | null;

    /**
     * The address that sent the VET.
     */
    readonly sender: Address | null;

    /**
     * The address that received the VET.
     */
    readonly recipient: Address | null;

    /**
     * Constructs a new TransferCriteria instance.
     *
     * @param txOrigin - The address from which the transaction was sent.
     * @param sender - The address that sent the VET.
     * @param recipient - The address that received the VET.
     */
    constructor(txOrigin: Address, sender: Address, recipient: Address) {
        this.txOrigin = txOrigin;
        this.sender = sender;
        this.recipient = recipient;
    }

    /**
     * Creates a new TransferCriteria instance.
     *
     * @param txOrigin - The address from which the transaction was sent.
     * @param sender - The address that sent the VET.
     * @param recipient - The address that received the VET.
     */
    static of(
        txOrigin: Address,
        sender: Address,
        recipient: Address
    ): TransferCriteria {
        return new TransferCriteria(txOrigin, sender, recipient);
    }
}

export { TransferCriteria };
