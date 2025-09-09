import { Address, HexUInt } from '@common/vcdm';
import { type SubscriptionTransferResponseJSON } from '@thor/thorest/subscriptions';
import { IllegalArgumentError } from '@common/errors';
import { LogMetaResponse } from '@thor/thorest';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/subscriptions/response/SubscriptionTransferResponse.ts!';

/**
 * [SubscriptionTransferResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionTransferResponse)
 *
 * Represents a transfer response from a subscription.
 */
class SubscriptionTransferResponse {
    /**
     * The sender address of the transfer.
     */
    readonly sender: Address;

    /**
     * The recipient address of the transfer.
     */
    readonly recipient: Address;

    /**
     * The amount of the transfer.
     */
    readonly amount: bigint;

    /**
     * Whether the transfer is obsolete.
     */
    readonly obsolete: boolean;

    /**
     * The log metadata associated with the transfer.
     */
    readonly meta: LogMetaResponse;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {SubscriptionTransferResponseJSON} json - The JSON object containing transfer response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: SubscriptionTransferResponseJSON) {
        try {
            this.sender = Address.of(json.sender);
            this.recipient = Address.of(json.recipient);
            this.amount = HexUInt.of(json.amount).bi;
            this.obsolete = json.obsolete;
            this.meta = new LogMetaResponse(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: SubscriptionTransferResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current transfer response data into a JSON representation.
     *
     * @returns {SubscriptionTransferResponseJSON} A JSON object containing the transfer response data.
     */
    toJSON(): SubscriptionTransferResponseJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: HexUInt.of(this.amount).toString(),
            obsolete: this.obsolete,
            meta: this.meta.toJSON()
        } satisfies SubscriptionTransferResponseJSON;
    }
}

export { SubscriptionTransferResponse };
