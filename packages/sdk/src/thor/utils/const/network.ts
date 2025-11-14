/**
 * The mainnet chain tag
 */
const MAINNET_CHAIN_TAG = 0x4a;

/**
 * The testnet chain tag
 */
const TESTNET_CHAIN_TAG = 0x27;

/**
 * Constant representing the zero address in hexadecimal format
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * VTHO token address (energy.sol smart contract address)
 */
const VTHO_ADDRESS = '0x0000000000000000000000000000456e65726779';

/**
 * The common network URLs
 */
enum ThorNetworks {
    MAINNET = 'https://mainnet.vechain.org/',
    SOLONET = 'http://localhost:8669/',
    TESTNET = 'https://testnet.vechain.org/'
}

/**
 * The mainnet genesis block id
 */
const MAINNET_GENESIS_BLOCK_ID =
    '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';

/**
 * The testnet genesis block id
 */
const TESTNET_GENESIS_BLOCK_ID =
    '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127';

export {
    MAINNET_CHAIN_TAG,
    TESTNET_CHAIN_TAG,
    VTHO_ADDRESS,
    ZERO_ADDRESS,
    ThorNetworks,
    MAINNET_GENESIS_BLOCK_ID,
    TESTNET_GENESIS_BLOCK_ID
};
