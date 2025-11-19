/**
 * Block with transactions expanded fixture
 */
declare const blockWithTransactionsExpanded: {
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
/**
 * Block with transactions not expanded fixture
 */
declare const blockWithTransactionsNotExpanded: {
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
/**
 * Valid transaction hash fixture
 */
declare const validTransactionHashTestnet = "0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c";
/**
 * Valid transaction detail fixture of the `validTransactionHashTestnet` transaction
 */
declare const validTransactionDetailTestnet: {
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
};
export { blockWithTransactionsExpanded, blockWithTransactionsNotExpanded, validTransactionHashTestnet, validTransactionDetailTestnet };
//# sourceMappingURL=fixture.d.ts.map