/**
 * Constant representing the zero address in hexadecimal format
 */
declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
/**
 * VTHO token address (energy.sol smart contract address)
 */
declare const VTHO_ADDRESS = "0x0000000000000000000000000000456e65726779";
/**
 * Constant defining VeChain mainnet information
 */
declare const MAINNET_NETWORK: {
    genesisBlock: {
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
        signer: string;
        isTrunk: boolean;
        transactions: never[];
    };
    chainTag: number;
};
/**
 * Constant defining VeChain testnet information
 */
declare const TESTNET_NETWORK: {
    genesisBlock: {
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
        signer: string;
        isTrunk: boolean;
        transactions: never[];
    };
    chainTag: number;
};
/**
 * Constant defining VeChain solo network information
 */
declare const SOLO_NETWORK: {
    genesisBlock: {
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
        signer: string;
        isTrunk: boolean;
        transactions: never[];
    };
    chainTag: number;
};
/**
 * Constant defining VeChain mainnet and testnet network information
 */
declare const networkInfo: {
    mainnet: {
        genesisBlock: {
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
            signer: string;
            isTrunk: boolean;
            transactions: never[];
        };
        chainTag: number;
    };
    testnet: {
        genesisBlock: {
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
            signer: string;
            isTrunk: boolean;
            transactions: never[];
        };
        chainTag: number;
    };
    solo: {
        genesisBlock: {
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
            signer: string;
            isTrunk: boolean;
            transactions: never[];
        };
        chainTag: number;
    };
};
export { networkInfo, VTHO_ADDRESS, ZERO_ADDRESS, MAINNET_NETWORK, TESTNET_NETWORK, SOLO_NETWORK };
//# sourceMappingURL=network.d.ts.map