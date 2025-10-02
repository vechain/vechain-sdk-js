interface BaseBlockSnapshot {
    number: number;
    id: string;
    size: number;
    parentID: string;
    timestamp: number;
    gasLimit: bigint;
    beneficiary: string;
    gasUsed: bigint;
    baseFeePerGas?: bigint;
    totalScore: number;
    txsRoot: string;
    txsFeatures: number;
    stateRoot: string;
    receiptsRoot: string;
    com: boolean;
    signer: string;
    isTrunk: boolean;
    isFinalized: boolean;
}

class BaseBlock {
    readonly number: number;

    readonly id: string;

    readonly size: number;

    readonly parentID: string;

    readonly timestamp: number;

    readonly gasLimit: bigint;

    readonly beneficiary: string;

    readonly gasUsed: bigint;

    readonly baseFeePerGas?: bigint;

    readonly totalScore: number;

    readonly txsRoot: string;

    readonly txsFeatures: number;

    readonly stateRoot: string;

    readonly receiptsRoot: string;

    readonly com: boolean;

    readonly signer: string;

    readonly isTrunk: boolean;

    readonly isFinalized: boolean;

    constructor(snapshot: BaseBlockSnapshot) {
        this.number = snapshot.number;
        this.id = snapshot.id;
        this.size = snapshot.size;
        this.parentID = snapshot.parentID;
        this.timestamp = snapshot.timestamp;
        this.gasLimit = snapshot.gasLimit;
        this.beneficiary = snapshot.beneficiary;
        this.gasUsed = snapshot.gasUsed;
        this.baseFeePerGas = snapshot.baseFeePerGas;
        this.totalScore = snapshot.totalScore;
        this.txsRoot = snapshot.txsRoot;
        this.txsFeatures = snapshot.txsFeatures;
        this.stateRoot = snapshot.stateRoot;
        this.receiptsRoot = snapshot.receiptsRoot;
        this.com = snapshot.com;
        this.signer = snapshot.signer;
        this.isTrunk = snapshot.isTrunk;
        this.isFinalized = snapshot.isFinalized;
    }
}

export { BaseBlock, type BaseBlockSnapshot };
