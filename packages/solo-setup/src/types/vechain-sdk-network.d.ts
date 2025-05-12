declare module '@vechain/sdk-network' {
    // Define BlockDetail interface
    interface BlockDetail {
        id: string;
        number: number;
        size: number;
        parentID: string;
        timestamp: number;
        gasLimit: number;
        beneficiary: string;
        gasUsed: number;
        baseFeePerGas?: string;
        totalScore: number;
        txsRoot: string;
        txsFeatures?: number;
        stateRoot: string;
        receiptsRoot: string;
        signer: string;
        com?: boolean;
        isFinalized?: boolean;
        isTrunk: boolean;
    }

    // Define CompressedBlockDetail interface
    interface CompressedBlockDetail extends BlockDetail {
        transactions: string[];
    }

    // Export the type
    export type { CompressedBlockDetail };
}
