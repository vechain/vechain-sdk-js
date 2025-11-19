type CompressedBlockDetail = {
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
    transactions: string[];
};
export interface ConfigData {
    TESTING_CONTRACT_ADDRESS: string;
    TESTING_CONTRACT_ABI: any[];
    TESTING_CONTRACT_BYTECODE: string;
    SOLO_GENESIS_BLOCK: CompressedBlockDetail;
    SOLO_CHAIN_TAG: number;
    SEED_VET_TX_ID: string;
    SEED_VTHO_TX_ID: string;
    SEED_TEST_TOKEN_TX_ID: string;
    TEST_TOKEN_ADDRESS: string;
}
declare const getConfigData: () => ConfigData;
/**
 * Writes configuration to config.json file
 */
declare function setConfig(address: string, abi: string | any[], // Allow abi as string or parsed array
bytecode: string | null, genesisBlock: CompressedBlockDetail, chainTag: number, seedVetTxId: string, seedVthoTxId: string, testTokenAddress: string, seedTestTokenTxId: string): void;
export { getConfigData, setConfig };
//# sourceMappingURL=configData.d.ts.map