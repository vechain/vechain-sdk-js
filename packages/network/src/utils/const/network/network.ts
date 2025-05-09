/**
 * Url of the mainnet
 */
const MAINNET_URL = 'https://mainnet.vechain.org';

/**
 * Url of the testnet
 */
const TESTNET_URL = 'https://testnet.vechain.org';

/**
 * Url of the solo network
 * Using explicit IPv4 (127.0.0.1) instead of localhost to avoid IPv6 resolution issues in CI
 */
const THOR_SOLO_URL = 'http://localhost:8669';

export { MAINNET_URL, TESTNET_URL, THOR_SOLO_URL };
