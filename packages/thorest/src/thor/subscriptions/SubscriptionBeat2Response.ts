import {
    BlockId,
    HexUInt,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { SubscriptionBeat2ResponseJSON } from './SubscriptionBeat2ResponseJSON';

const FQP =
    'packages/thorest/src/thor/subscriptions/SubscriptionBeat2Response.ts!';

class SubscriptionBeat2Response {
    readonly gasLimit: bigint;
    readonly obsolete: boolean;
    readonly number: UInt;
    readonly id: BlockId;
    readonly parentID: BlockId;
    readonly timestamp: UInt;
    readonly txsFeatures: UInt;
    readonly bloom: HexUInt;
    readonly k: UInt;

    constructor(json: SubscriptionBeat2ResponseJSON) {
        try {
            this.gasLimit = BigInt(json.gasLimit);
            this.obsolete = json.obsolete;
            this.number = UInt.of(json.number);
            this.id = BlockId.of(json.id);
            this.parentID = BlockId.of(json.parentID);
            this.timestamp = UInt.of(json.timestamp);
            this.txsFeatures = UInt.of(json.txsFeatures);
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
