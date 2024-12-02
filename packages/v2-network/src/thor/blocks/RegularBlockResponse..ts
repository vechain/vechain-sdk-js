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

class RegularBlockResponse {
    readonly number: number;
    readonly id: string;
    readonly size: number;
    readonly parentID: string;
    readonly timestamp: bigint;
    readonly gasLimit: number;
    readonly beneficiary: string;
    readonly gasUsed: number;
    readonly totalScore: number;
    readonly txsRoot: string;
    readonly txsFeatures: number;
    readonly stateRoot: string;
    readonly receiptsRoot: string;
    readonly com: boolean;
    readonly signer: string;
    readonly isTrunk: boolean;
    readonly isFinalized: boolean;
    readonly transactions: string[];

    constructor(json: RegularBlockResponseJSON) {
        this.number = json.number;
        this.id = json.id;
        this.size = json.size;
        this.parentID = json.parentID;
        this.timestamp = json.timestamp;
        this.gasLimit = json.gasLimit;
        this.beneficiary = json.beneficiary;
        this.gasUsed = json.gasUsed;
        this.totalScore = json.totalScore;
        this.txsRoot = json.txsRoot;
        this.txsFeatures = json.txsFeatures;
        this.stateRoot = json.stateRoot;
        this.receiptsRoot = json.receiptsRoot;
        this.com = json.com;
        this.signer = json.signer;
        this.isTrunk = json.isTrunk;
        this.isFinalized = json.isFinalized;
        this.transactions = json.transactions;
    }
}

export { RegularBlockResponse, type RegularBlockResponseJSON };
