import { type Address } from '@vcdm';
import { type TransferCriteriaJSON } from '@thor/json';
import { type TransferCriteria } from '@thor/thor-client/model/logs/TransferCriteria';

/**
 * Filter criteria for transfer events.
 */
class TransferCriteriaRequest {
    /**
     * The address from which the transfer was initiated.
     */
    readonly txOrigin?: Address;

    /**
     * The address that sent the VET.
     */
    readonly sender?: Address;

    /**
     * The address that received the VET.
     */
    readonly recipient?: Address;

    /**
     * Constructs an instance of the class.
     *
     * @param {Address} txOrigin - The address from which the transfer was initiated.
     * @param {Address} sender - The address that sent the VET.
     * @param {Address} recipient - The address that received the VET.
     */
    constructor(txOrigin?: Address, sender?: Address, recipient?: Address) {
        this.txOrigin = txOrigin;
        this.sender = sender;
        this.recipient = recipient;
    }

    /**
     * Constructs an instance of the class from a TransferCriteria.
     *
     * @param {TransferCriteria} criteria - The TransferCriteria to convert to a TransferCriteriaRequest.
     * @return {TransferCriteriaRequest} The TransferCriteriaRequest instance created from the TransferCriteria.
     */
    static of(criteria: TransferCriteria): TransferCriteriaRequest {
        return new TransferCriteriaRequest(
            criteria.txOrigin ?? undefined,
            criteria.sender ?? undefined,
            criteria.recipient ?? undefined
        );
    }

    /**
     * Converts into a JSON representation.
     *
     * @return {TransferCriteriaJSON} The JSON object representing the current TransferCriteriaRequest instance.
     */
    toJSON(): TransferCriteriaJSON {
        return {
            txOrigin: this.txOrigin?.toString(),
            sender: this.sender?.toString(),
            recipient: this.recipient?.toString()
        } satisfies TransferCriteriaJSON;
    }
}

export { TransferCriteriaRequest };
