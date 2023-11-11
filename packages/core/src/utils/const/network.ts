/**
 * Constants defining Vechain mainnet chain tag. The chain tag is the last byte of the genesis block ID
 */
const VECHAIN_MAINNET_CHAIN_TAG = 0x4a;

/**
 * Constants defining Vechain testnet chain tag. The chain tag is the last byte of the genesis block ID
 */
const VECHAIN_TESTNET_CHAIN_TAG = 0x27;

/**
 * Constant representing the zero address in hexadecimal format
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Constants defining the genesis blocks for Vechain mainnet and testnet
 */
const genesisBlocks = {
    main: {
        number: 0,
        id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
        size: 170,
        parentID:
            '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
        timestamp: 1530316800,
        gasLimit: 10000000,
        beneficiary: '0x0000000000000000000000000000000000000000',
        gasUsed: 0,
        totalScore: 0,
        txsRoot:
            '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
        txsFeatures: 0,
        stateRoot:
            '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
        receiptsRoot:
            '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
        signer: '0x0000000000000000000000000000000000000000',
        isTrunk: true,
        transactions: []
    },
    test: {
        number: 0,
        id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
        size: 170,
        parentID:
            '0xffffffff00000000000000000000000000000000000000000000000000000000',
        timestamp: 1530014400,
        gasLimit: 10000000,
        beneficiary: '0x0000000000000000000000000000000000000000',
        gasUsed: 0,
        totalScore: 0,
        txsRoot:
            '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
        txsFeatures: 0,
        stateRoot:
            '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
        receiptsRoot:
            '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
        signer: '0x0000000000000000000000000000000000000000',
        isTrunk: true,
        transactions: []
    }
};

/**
 * @ignore
 * Constants defining Vechain mainnet and testnet network information
 */
const networkInfo = {
    mainnet: {
        genesisBlock: genesisBlocks.main,
        chainTag: VECHAIN_MAINNET_CHAIN_TAG,
        zeroAddress: ZERO_ADDRESS
    },
    testnet: {
        genesisBlock: genesisBlocks.test,
        chainTag: VECHAIN_TESTNET_CHAIN_TAG,
        zeroAddress: ZERO_ADDRESS
    }
};

export { networkInfo };
