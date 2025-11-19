"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainTagToChainId = exports.CHAIN_TAG = exports.CHAIN_ID = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Chain ID's this is the blockId of the genesis block
 */
const CHAIN_ID = {
    MAINNET: '0x186a9',
    TESTNET: '0x186aa',
    SOLO_DEFAULT: '0xf6'
};
exports.CHAIN_ID = CHAIN_ID;
const CHAIN_TAG = {
    MAINNET: '0x4a',
    TESTNET: '0x27',
    SOLO_DEFAULT: '0xf6'
};
exports.CHAIN_TAG = CHAIN_TAG;
/**
 * Converts a chain tag to a chain Id
 * @param chainTag chain tag as last byte of genesis block id
 * @returns chain id
 */
const chainTagToChainId = (chainTag) => {
    if (chainTag.isEqual(sdk_core_1.HexUInt.of(CHAIN_TAG.MAINNET))) {
        return sdk_core_1.HexUInt.of(CHAIN_ID.MAINNET);
    }
    else if (chainTag.isEqual(sdk_core_1.HexUInt.of(CHAIN_TAG.TESTNET))) {
        return sdk_core_1.HexUInt.of(CHAIN_ID.TESTNET);
    }
    else if (chainTag.isEqual(sdk_core_1.HexUInt.of(CHAIN_TAG.SOLO_DEFAULT))) {
        return sdk_core_1.HexUInt.of(CHAIN_ID.SOLO_DEFAULT);
    }
    else {
        return chainTag;
    }
};
exports.chainTagToChainId = chainTagToChainId;
