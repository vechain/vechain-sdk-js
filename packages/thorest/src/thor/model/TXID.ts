import { type TXIDJSON } from '@thor';
import { IllegalArgumentError, TxId as TransactionId } from '@vechain/sdk-core';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/model/TXID.ts!';

/**
 * [TXID](http://localhost:8669/doc/stoplight-ui/#/schemas/TXID)
 */
class TXID {
    readonly id: TransactionId;

    /**
     * Constructs an instance of the class using the provided TXIDJSON object.
     * @param json The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} If the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: TXIDJSON) {
        try {
            this.id = TransactionId.of(json.id);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TXIDJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into an OutputJSON representation.
     *
     * @return {TXIDJSON} The JSON object representing the current instance.
     */
    toJSON(): TXIDJSON {
        return {
            id: this.id.toString()
        } satisfies TXIDJSON;
    }
}

export { TXID };
