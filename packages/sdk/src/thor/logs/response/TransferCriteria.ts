import { Address, IllegalArgumentError } from '@vcdm';
import { type TransferCriteriaJSON } from '@thor';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/logs/TransferCriteria.ts!';

/**
 * [TransferCriteria](http://localhost:8669/doc/stoplight-ui/#/schemas/TransferCriteria)
 */
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
     * Constructs a new instance of the class using the provided TransferCriteriaJSON object.
     *
     * @param {TransferCriteriaJSON} json - The input object containing transfer criteria details. It may contain the properties `txOrigin`, `sender`, and `recipient`.
     * @throws {IllegalArgumentError}  If the provided JSON object contains invalid or unparsable data.
     */
    constructor(json: TransferCriteriaJSON) {
        try {
            this.txOrigin =
                json.txOrigin === undefined ? null : Address.of(json.txOrigin);
            this.sender =
                json.sender === undefined ? null : Address.of(json.sender);
            this.recipient =
                json.recipient === undefined
                    ? null
                    : Address.of(json.recipient);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransferCriteriaJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current TransferCriteria instance into a JSON serializable object.
     *
     * @return {TransferCriteriaJSON} A JSON representation of the TransferCriteria object.
     */
    toJSON(): TransferCriteriaJSON {
        return {
            txOrigin:
                this.txOrigin === null ? undefined : this.txOrigin.toString(),
            sender: this.sender === null ? undefined : this.sender.toString(),
            recipient:
                this.recipient === null ? undefined : this.recipient.toString()
        } satisfies TransferCriteriaJSON;
    }
}

export { TransferCriteria };
