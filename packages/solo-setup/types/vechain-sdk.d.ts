// Local type declarations for @vechain/sdk-thorest-api
// This allows TypeScript compilation in CI where peer dependencies aren't installed

declare module '@vechain/sdk' {
    export interface RegularBlockResponse {
        id: string;
        number: number;
        size: number;
        parentID: string;
        timestamp: number;
        gasLimit: number;
        gasUsed: number;
        totalScore: number;
        txsRoot: string;
        txsFeatures: number;
        stateRoot: string;
        receiptsRoot: string;
        signer: string;
        transactions: string[];
        [key: string]: any;
    }
}
