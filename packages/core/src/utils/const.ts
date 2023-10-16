import { RLP } from '../encoding';

/**
 * Default VET derivation path.
 * @public
 *
 * See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for more info.
 */
const VET_DERIVATION_PATH = `m/44'/818'/0'/0`;

/**
 * Prefix for extended public key
 * @public
 */
const X_PUB_PREFIX = Buffer.from('0488b21e000000000000000000', 'hex');

/**
 * Prefix for extended private key
 * @public
 */
const X_PRIV_PREFIX = Buffer.from('0488ade4000000000000000000', 'hex');

/**
 * Keystore Scrypt params
 * @public
 */
const SCRYPT_PARAMS = {
    N: 131072,
    r: 8,
    p: 1
};

/**
 * Zero buffer
 * @public
 *
 * @example ZERO_BUFFER(8) -> 0x00000000 , ... , ZERO_BUFFER(n) -> 0x0...0
 */
const ZERO_BUFFER = (size: number): Buffer => Buffer.alloc(size, 0);

/**
 * Biggest value of private key
 * @public
 */
const PRIVATE_KEY_MAX_VALUE = Buffer.from(
    'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
    'hex'
);

/**
 * Regular expression for validating hexadecimal strings.
 * Allows optional "0x" prefix and validates both lower and uppercase hex characters.
 * @public
 */
const HEX_REGEX = /^(0x)?[0-9a-fA-F]*$/;
const HEX_REGEX_WITH_PREFIX_CASE_INSENSITIVE = /^0x[0-9a-f]*$/i;

const HEX_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i;

const BLOOM_REGEX_UPPERCASE = /^(0x)?[0-9A-F]{16,}$/;
const BLOOM_REGEX_LOWERCASE = /^(0x)?[0-9a-f]{16,}$/;

/**
 * Transaction gas constants
 * @public
 */
const TRANSACTIONS_GAS_CONSTANTS = {
    /**
     * Default gas for a transaction
     */
    TX_GAS: 5000,

    /**
     * Default gas for a clause
     */
    CLAUSE_GAS: 16000,

    /**
     * Default gas for a contract creation clause
     */
    CLAUSE_GAS_CONTRACT_CREATION: 48000,

    /**
     * Zero gas data
     */
    ZERO_GAS_DATA: 4,

    /**
     * Non-zero gas data
     */
    NON_ZERO_GAS_DATA: 68
};

/**
 * Main transaction fields
 * @private
 */
const TRANSACTION_FIELDS = [
    /**
     * Chain tag. It represents the id of the chain the transaction is sent to.
     */
    { name: 'chainTag', kind: new RLP.NumericKind(1) },

    /**
     * Block reference. It represents the last block of the chain the transaction is sent to.
     */
    // { name: 'blockRef', kind: new RLP.CompactFixedBlobKind(8) },

    /**
     * Expiration. It represents the expiration date of the transaction.
     */
    { name: 'expiration', kind: new RLP.NumericKind(4) },

    /**
     * Clauses of the transaction. They represent the actions to be executed by the transaction.
     */
    {
        name: 'clauses',
        kind: {
            item: [
                // { name: 'to', kind: new RLP.NullableFixedBlobKind(20) },
                { name: 'value', kind: new RLP.NumericKind(32) }
                // { name: 'data', kind: new RLP.BlobKind() }
            ]
        }
    },

    /**
     * Gas price coef. It represents the gas price coefficient of the transaction.
     */
    { name: 'gasPriceCoef', kind: new RLP.NumericKind(1) },

    /**
     * Gas. It represents the gas limit of the transaction.
     */
    { name: 'gas', kind: new RLP.NumericKind(8) },

    /**
     * Depends on. It represents the hash of the transaction the current transaction depends on.
     */
    // { name: 'dependsOn', kind: new RLP.NullableFixedBlobKind(32) },

    /**
     * Nonce. It represents the nonce of the transaction.
     */
    { name: 'nonce', kind: new RLP.NumericKind(8) },

    /**
     * Reserved. It represents the reserved field of the transaction.
     */
    { name: 'reserved', kind: { item: new RLP.BufferKind() } }
];

/**
 * RLP profiler for simple unsigned transactions
 * @public
 */
const UNSIGNED_TRANSACTION_RLP = new RLP.Profiler({
    name: 'tx',
    kind: TRANSACTION_FIELDS
});

/**
 * RLP profiler for simple signed transactions
 * @public
 */
const SIGNED_TRANSACTION_RLP = new RLP.Profiler({
    name: 'tx',
    kind: TRANSACTION_FIELDS.concat([
        { name: 'signature', kind: new RLP.BufferKind() }
    ])
});

export {
    VET_DERIVATION_PATH,
    X_PUB_PREFIX,
    X_PRIV_PREFIX,
    SCRYPT_PARAMS,
    ZERO_BUFFER,
    PRIVATE_KEY_MAX_VALUE,
    HEX_REGEX,
    HEX_ADDRESS_REGEX,
    HEX_REGEX_WITH_PREFIX_CASE_INSENSITIVE,
    BLOOM_REGEX_LOWERCASE,
    BLOOM_REGEX_UPPERCASE,
    TRANSACTIONS_GAS_CONSTANTS,
    UNSIGNED_TRANSACTION_RLP,
    SIGNED_TRANSACTION_RLP
};
