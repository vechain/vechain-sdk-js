import { BlockId, HexUInt, Units, VTHO } from '@vechain/sdk-core';
import { UInt } from '../../../../core';

class SubscriptionBeat2Response {
    readonly gasLimit: VTHO;
    readonly obsolete: boolean;
    readonly number: UInt;
    readonly id: BlockId;
    readonly parentID: BlockId;
    readonly timestamp: UInt;
    readonly txsFeatures: UInt;
    readonly bloom: HexUInt;
    readonly k: UInt;

    constructor(json: SubscriptionBeat2ResponseJSON) {
        this.gasLimit = VTHO.of(json.gasLimit, Units.wei);
        this.obsolete = json.obsolete;
        this.number = UInt.of(json.number);
        this.id = BlockId.of(json.id);
        this.parentID = BlockId.of(json.parentID);
        this.timestamp = UInt.of(json.timestamp);
        this.txsFeatures = UInt.of(json.txsFeatures);
        this.bloom = HexUInt.of(json.bloom);
        this.k = UInt.of(json.k);
    }

    toJSON(): SubscriptionBeat2ResponseJSON {
        return {
            gasLimit: Number(this.gasLimit.wei),
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

interface SubscriptionBeat2ResponseJSON {
    gasLimit: number;
    obsolete: boolean;
    number: number;
    id: string;
    parentID: string;
    timestamp: number;
    txsFeatures: number;
    bloom: string;
    k: number;
}

export { SubscriptionBeat2Response, type SubscriptionBeat2ResponseJSON };
