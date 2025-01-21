import { Address, ThorId, Units, VTHO } from '@vechain/sdk-core';
import { UInt } from '../../../../core/src';

class RegularBlockResponse {
    readonly number: UInt;
    readonly id: ThorId;
    readonly size: UInt;
    readonly parentID: ThorId;
    readonly timestamp: bigint;
    readonly gasLimit: VTHO;
    readonly beneficiary: Address;
    readonly gasUsed: VTHO;
    readonly totalScore: UInt;
    readonly txsRoot: ThorId;
    readonly txsFeatures: UInt;
    readonly stateRoot: ThorId;
    readonly receiptsRoot: ThorId;
    readonly com: boolean;
    readonly signer: Address;
    readonly isTrunk: boolean;
    readonly isFinalized: boolean;
    readonly transactions: ThorId[];

    constructor(json: RegularBlockResponseJSON) {
        this.number = UInt.of(json.number);
        this.id = ThorId.of(json.id);
        this.size = UInt.of(json.size);
        this.parentID = ThorId.of(json.parentID);
        this.timestamp = json.timestamp;
        this.gasLimit = VTHO.of(json.gasLimit, Units.wei);
        this.beneficiary = Address.of(json.beneficiary);
        this.gasUsed = VTHO.of(json.gasUsed, Units.wei);
        this.totalScore = UInt.of(json.totalScore);
        this.txsRoot = ThorId.of(json.txsRoot);
        this.txsFeatures = UInt.of(json.txsFeatures);
        this.stateRoot = ThorId.of(json.stateRoot);
        this.receiptsRoot = Address.of(json.receiptsRoot);
        this.com = json.com;
        this.signer = Address.of(json.signer);
        this.isTrunk = json.isTrunk;
        this.isFinalized = json.isFinalized;
        this.transactions = json.transactions.map(
            (txId: string): ThorId => ThorId.of(txId)
        );
    }

    toJSON(): RegularBlockResponseJSON {
        return {
            number: this.number.valueOf(),
            id: this.id.toString(),
            size: this.size.valueOf(),
            parentID: this.parentID.toString(),
            timestamp: this.timestamp,
            gasLimit: Number(this.gasLimit.wei),
            beneficiary: this.beneficiary.toString(),
            gasUsed: Number(this.gasUsed.wei),
            totalScore: this.totalScore.valueOf(),
            txsRoot: this.txsRoot.toString(),
            txsFeatures: this.txsFeatures.valueOf(),
            stateRoot: this.stateRoot.toString(),
            receiptsRoot: this.receiptsRoot.toString(),
            com: this.com,
            signer: this.signer.toString(),
            isTrunk: this.isTrunk,
            isFinalized: this.isFinalized,
            transactions: this.transactions.map((txId: ThorId) =>
                txId.toString()
            )
        } satisfies RegularBlockResponseJSON;
    }
}

interface RegularBlockResponseJSON {
    number: number;
    id: string;
    size: number;
    parentID: string;
    timestamp: bigint;
    gasLimit: number;
    beneficiary: string;
    gasUsed: number;
    totalScore: number;
    txsRoot: string;
    txsFeatures: number;
    stateRoot: string;
    receiptsRoot: string;
    com: boolean;
    signer: string;
    isTrunk: boolean;
    isFinalized: boolean;
    transactions: string[];
}

export { RegularBlockResponse, type RegularBlockResponseJSON };
