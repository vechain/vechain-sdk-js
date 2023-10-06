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

/**
 * Regular expression for validating hexadecimal strings.
 * Allows optional "0x" prefix and validates both lower and uppercase hex characters.
 */
const HEX_REGEX = /^(0x)?[0-9a-fA-F]*$/;

const HEX_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i;

const BLOOM_REGEX_UPPERCASE = /^(0x)?[0-9A-F]{16,}$/;
const BLOOM_REGEX_LOWERCASE = /^(0x)?[0-9a-f]{16,}$/;

export {
    VET_DERIVATION_PATH,
    X_PUB_PREFIX,
    X_PRIV_PREFIX,
    SCRYPT_PARAMS,
    ZERO_BUFFER,
    PRIVATE_KEY_MAX_VALUE,
    HEX_REGEX,
    HEX_ADDRESS_REGEX,
    BLOOM_REGEX_LOWERCASE,
    BLOOM_REGEX_UPPERCASE
};
