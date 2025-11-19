import { HexUInt } from '@vechain/sdk-core';
/**
 * Chain ID's this is the blockId of the genesis block
 */
declare const CHAIN_ID: {
    MAINNET: string;
    TESTNET: string;
    SOLO_DEFAULT: string;
};
declare const CHAIN_TAG: {
    MAINNET: string;
    TESTNET: string;
    SOLO_DEFAULT: string;
};
/**
 * Converts a chain tag to a chain Id
 * @param chainTag chain tag as last byte of genesis block id
 * @returns chain id
 */
declare const chainTagToChainId: (chainTag: HexUInt) => HexUInt;
export { CHAIN_ID, CHAIN_TAG, chainTagToChainId };
//# sourceMappingURL=chain-id.d.ts.map