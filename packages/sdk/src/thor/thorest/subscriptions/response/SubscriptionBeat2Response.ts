import { type Hex, HexUInt, HexUInt32, UInt } from '@common/vcdm';
import { type SubscriptionBeat2ResponseJSON } from '@thor/thorest/subscriptions';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/core/src/thor/subscriptions/SubscriptionBeat2Response.ts!';

/**
 * [SubscriptionBeat2Response](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionBeat2Response)
 *
 * Represents a beat2 response from a subscription.
 */
class SubscriptionBeat2Response {
    /**
     * The maximum amount of gas that all transactions inside the block are allowed to consume.
     */
    readonly gasLimit: bigint;

    /**
     * Whether the beat is obsolete.
     */
    readonly obsolete: boolean;

    /**
     * The block number (height).
     */
    readonly number: number;

    /**
     * The block identifier.
     */
    readonly id: Hex;

    /**
     * The parent block identifier.
     */
    readonly parentID: Hex;

    /**
     * The UNIX timestamp of the block.
     */
    readonly timestamp: number;

    /**
     * The supported transaction features bitset.
     */
    readonly txsFeatures: number;

    /**
     * The bloom filter for the block.
     */
    readonly bloom: Hex;

    /**
     * The k value for the block.
     */
    readonly k: UInt;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {SubscriptionBeat2ResponseJSON} json - The JSON object containing beat2 response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: SubscriptionBeat2ResponseJSON) {
        try {
            this.gasLimit = BigInt(json.gasLimit);
            this.obsolete = json.obsolete;
            this.number = UInt.of(json.number).valueOf();
            this.id = HexUInt32.of(json.id);
            this.parentID = HexUInt32.of(json.parentID);
            this.timestamp = UInt.of(json.timestamp).valueOf();
            this.txsFeatures = UInt.of(json.txsFeatures).valueOf();
            this.bloom = HexUInt.of(json.bloom);
            this.k = UInt.of(json.k);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: SubscriptionBeat2ResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current beat2 response data into a JSON representation.
     *
     * @returns {SubscriptionBeat2ResponseJSON} A JSON object containing the beat2 response data.
     */
    toJSON(): SubscriptionBeat2ResponseJSON {
        return {
            gasLimit: Number(this.gasLimit),
            obsolete: this.obsolete,
            number: this.number.valueOf(),
            id: this.id.toString(),
            parentID: this.parentID.toString(),
            timestamp: this.timestamp.valueOf(),
            txsFeatures: this.txsFeatures.valueOf(),
            bloom: this.bloom.toString(),
            k: this.k.valueOf()
        } satisfies SubscriptionBeat2ResponseJSON;
    }
}

export { SubscriptionBeat2Response };
