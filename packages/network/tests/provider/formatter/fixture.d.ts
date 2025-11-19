/**
 * Block fixtures
 */
declare const blockFixtures: ({
    testName: string;
    block: {
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
        com: false;
        signer: string;
        isTrunk: true;
        isFinalized: true;
        transactions: string[];
    };
    expected: {
        hash: string;
        parentHash: string;
        number: string;
        size: string;
        stateRoot: string;
        receiptsRoot: string;
        transactionsRoot: string;
        timestamp: string;
        gasLimit: string;
        gasUsed: string;
        transactions: string[];
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        uncles: never[];
        sha3Uncles: string;
        nonce: string;
        logsBloom: string;
        extraData: string;
        baseFeePerGas: undefined;
        mixHash: string;
    };
} | {
    testName: string;
    block: {
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
        com: false;
        signer: string;
        isTrunk: true;
        isFinalized: true;
        transactions: {
            id: string;
            chainTag: string;
            blockRef: string;
            expiration: number;
            clauses: {
                to: string;
                value: string;
                data: string;
            }[];
            gasPriceCoef: number;
            gas: number;
            origin: string;
            delegator: string;
            nonce: string;
            dependsOn: string;
            size: number;
            gasUsed: number;
            gasPayer: string;
            paid: string;
            reward: string;
            reverted: false;
            outputs: {
                contractAddress: null;
                events: never[];
                transfers: never[];
            }[];
        }[];
    };
    expected: {
        hash: string;
        parentHash: string;
        number: string;
        size: string;
        stateRoot: string;
        receiptsRoot: string;
        transactionsRoot: string;
        timestamp: string;
        gasLimit: string;
        gasUsed: string;
        transactions: {
            blockHash: string;
            blockNumber: string;
            from: string;
            gas: string;
            chainId: string;
            hash: string;
            nonce: string;
            transactionIndex: string;
            input: string;
            to: string;
            value: string;
            gasPrice: string;
            type: string;
            v: string;
            r: string;
            s: string;
            accessList: never[];
            maxFeePerGas: undefined;
            maxPriorityFeePerGas: undefined;
            yParity: string;
        }[];
        miner: string;
        difficulty: string;
        totalDifficulty: string;
        uncles: never[];
        sha3Uncles: string;
        nonce: string;
        logsBloom: string;
        extraData: string;
        baseFeePerGas: undefined;
        mixHash: string;
    };
})[];
/**
 * Transaction fixtures
 */
declare const transactionFixtures: {
    testName: string;
    transaction: {
        id: string;
        chainTag: number;
        blockRef: string;
        expiration: number;
        type: number;
        clauses: never[];
        gasPriceCoef: number;
        gas: number;
        origin: string;
        gasPayer: null;
        nonce: string;
        dependsOn: null;
        size: number;
        meta: {
            blockID: string;
            blockNumber: number;
            blockTimestamp: number;
        };
    };
    expected: {
        blockHash: string;
        blockNumber: string;
        from: string;
        gas: string;
        chainId: string;
        hash: string;
        nonce: string;
        transactionIndex: string;
        input: string;
        to: null;
        value: string;
        gasPrice: string;
        type: string;
        v: string;
        r: string;
        s: string;
        accessList: never[];
        maxFeePerGas: undefined;
        maxPriorityFeePerGas: undefined;
        yParity: string;
    };
}[];
export { blockFixtures, transactionFixtures };
//# sourceMappingURL=fixture.d.ts.map