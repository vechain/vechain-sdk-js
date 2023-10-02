/**
 * Default VET derivation path.
 * See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for more info.
 */
const VET_DERIVATION_PATH = `m/44'/818'/0'/0`;

/**
 * Prefix for extended public key
 */
const X_PUB_PREFIX = Buffer.from('0488b21e000000000000000000', 'hex');

/**
 * Prefix for extended private key
 */
const X_PRIV_PREFIX = Buffer.from('0488ade4000000000000000000', 'hex');

/**
 * Keystore Scrypt params
 */
const SCRYPT_PARAMS = {
    N: 131072,
    r: 8,
    p: 1
};

/**
 * Zero buffer
 *
 * 0x0...0
 */
const ZERO_BUFFER = (size: number): Buffer => Buffer.alloc(size, 0);

/**
 * Biggest value of private key
 */
const PRIVATE_KEY_MAX_VALUE = Buffer.from(
    'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
    'hex'
);

export {
    VET_DERIVATION_PATH,
    X_PUB_PREFIX,
    X_PRIV_PREFIX,
    SCRYPT_PARAMS,
    ZERO_BUFFER,
    PRIVATE_KEY_MAX_VALUE
};
