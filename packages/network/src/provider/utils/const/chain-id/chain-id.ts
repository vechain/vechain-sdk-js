/**
 * Chain ID's this is the blockId of the genesis block
 * Note the Solo block id here is the default - if using a custom genesis file this will be different
 */
const CHAIN_ID = {
    MAINNET:
        '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
    TESTNET:
        '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    SOLO: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6'
};

export { CHAIN_ID };
