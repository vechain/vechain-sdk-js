import {
    Address,
    HexUInt,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { type TransferJSON } from '@thor';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/model/Transfer.ts!';

/**
 * [Transfer](http://localhost:8669/doc/stoplight-ui/#/schemas/Transfer)
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
    readonly amount: UInt;

    /**
     * Constructs an instance of the class using the provided TransferJSON object.
     *
     * @param {TransferJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: TransferJSON) {
        try {
            this.sender = Address.of(json.sender);
            this.recipient = Address.of(json.recipient);
            this.amount = UInt.of(HexUInt.of(json.amount).n);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransferJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a TransferJSON representation.
     *
     * @return {TransferJSON} The JSON object representing the current instance.
     */
    toJSON(): TransferJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: HexUInt.of(this.amount.valueOf()).toString()
        } satisfies TransferJSON;
    }
}

export { Transfer };
