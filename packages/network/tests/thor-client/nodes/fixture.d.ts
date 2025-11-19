/**
 * @internal
 * Block with a timestamp much older than the current time
 */
declare const blockWithOldTimeStamp: {
    number: number;
    id: string;
    size: number;
    parentID: string;
    timestamp: number;
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
    transactions: never[];
};
/**
 * @internal
 * Block with a missing timestamp
 */
declare const blockWithMissingTimeStamp: {
    number: number;
    id: string;
    size: number;
    parentID: string;
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
    transactions: never[];
};
/**
 * @internal
 * Block with an invalid timestamp format
 */
declare const blockWithInvalidTimeStampFormat: {
    number: number;
    id: string;
    size: number;
    parentID: string;
    timestamp: string;
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
    transactions: never[];
};
export { blockWithOldTimeStamp, blockWithMissingTimeStamp, blockWithInvalidTimeStampFormat };
//# sourceMappingURL=fixture.d.ts.map