/**
 * [SubscriptionBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionBlockResponse)
 */
interface SubscriptionBlockResponseJSON {
    number: number;
    id: string;
    size: number;
    parentID: string;
    timestamp: number;
    gasLimit: number;
    beneficiary: string;
    gasUsed: number;
    baseFeePerGas?: string;
    totalScore: number;
    txsRoot: string;
    txsFeatures: number;
    stateRoot: string;
    receiptsRoot: string;
    com: boolean;
    signer: string;
    obsolete: boolean;
    transactions: string[];
}

export { type SubscriptionBlockResponseJSON };
