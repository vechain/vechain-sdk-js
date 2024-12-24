import { BlockId, HexUInt, Units, VTHO } from '@vechain/sdk-core';
import { UInt } from '../../../../core';

class SubscriptionBeat2Response {
    gasLimit: VTHO;
    obsolete: boolean;
    number: UInt;
    id: BlockId;
    parentID: BlockId;
    timestamp: UInt;
    txsFeatures: UInt;
    bloom: HexUInt;
    k: UInt;

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
