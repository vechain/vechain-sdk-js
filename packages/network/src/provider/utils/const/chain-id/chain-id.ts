import { HexUInt } from '@vechain/sdk-core';

/**
 * Chain ID is last 2 bytes of the blockId of the genesis block
 */
const CHAIN_ID = {
    MAINNET: '0x1b4a',
    TESTNET: '0xb127',
    SOLO_DEFAULT: '0x73f6'
};

const CHAIN_TAG = {
    MAINNET: '0x1b4a',
    TESTNET: '0xb127',
    SOLO_DEFAULT: '0x73f6'
};

/**
 * Converts a chain tag to a chain Id
 * @param chainTag chain tag as last byte of genesis block id
 * @returns chain id
 */
const chainTagToChainId = (chainTag: HexUInt): HexUInt => {
    if (chainTag.isEqual(HexUInt.of(CHAIN_TAG.MAINNET))) {
        return HexUInt.of(CHAIN_ID.MAINNET);
    } else if (chainTag.isEqual(HexUInt.of(CHAIN_TAG.TESTNET))) {
        return HexUInt.of(CHAIN_ID.TESTNET);
    } else if (chainTag.isEqual(HexUInt.of(CHAIN_TAG.SOLO_DEFAULT))) {
        return HexUInt.of(CHAIN_ID.SOLO_DEFAULT);
    } else {
        return chainTag;
    }
};

export { CHAIN_ID, CHAIN_TAG, chainTagToChainId };
