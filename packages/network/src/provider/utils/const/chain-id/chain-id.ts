/**
 * Chain ID is last 2 bytes of the blockId of the genesis block
 */
const CHAIN_ID = {
    MAINNET: '0x1b4a',
    TESTNET: '0xb127',
    SOLO_DEFAULT: '0x69f6'
};

/**
 * Chain Tag is last byte of the blockId of the genesis block
 */
const CHAIN_TAG = {
    MAINNET: '0x4a',
    TESTNET: '0x27',
    SOLO_DEFAULT: '0xf6'
};

export { CHAIN_ID, CHAIN_TAG };
