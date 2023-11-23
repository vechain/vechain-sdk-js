/**
 * Default VET derivation path.
 *
 * See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for more info.
 */
const VET_DERIVATION_PATH = "m/44'/818'/0'/0";

/**
 * Prefix for extended public key
 */
const X_PUB_PREFIX = Buffer.from('0488b21e000000000000000000', 'hex');

/**
 * Prefix for extended private key
 */
const X_PRIV_PREFIX = Buffer.from('0488ade4000000000000000000', 'hex');

export { VET_DERIVATION_PATH, X_PUB_PREFIX, X_PRIV_PREFIX };
