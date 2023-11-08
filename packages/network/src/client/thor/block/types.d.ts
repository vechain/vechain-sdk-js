interface BlockDetail {
    id: string;
    number: number;
    size: number;
    parentID: string;
    timestamp: number;
    gasLimit: number;
    beneficiary: string;
    gasUsed: number;
    totalScore: number;
    txsRoot: string;
    txsFeatures?: number;
    stateRoot: string;
    receiptsRoot: string;
    signer: string;
    transactions: string[];
    com?: boolean;
    isFinalized?: boolean;
    isTrunk: boolean;
}

export type { BlockDetail };
