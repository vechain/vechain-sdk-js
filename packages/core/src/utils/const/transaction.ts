import { RLP_CODER } from '../../encoding';

/**
 * Transaction gas constants
 */
const TRANSACTIONS_GAS_CONSTANTS = {
    /**
     * Default gas for a transaction
     * @internal
     */
    TX_GAS: 5000,

    /**
     * Default gas for a clause
     * @internal
     */
    CLAUSE_GAS: 16000,

    /**
     * Default gas for a contract creation clause
     * @internal
     */
    CLAUSE_GAS_CONTRACT_CREATION: 48000,

    /**
     * Zero gas data
     * @internal
     */
    ZERO_GAS_DATA: 4,

    /**
     * Non-zero gas data
     * @internal
     */
    NON_ZERO_GAS_DATA: 68
};

/**
 * Main transaction fields
 * @internal
 */
const TRANSACTION_FIELDS = [
    /**
     * Chain tag. It represents the id of the chain the transaction is sent to.
     */
    { name: 'chainTag', kind: new RLP_CODER.NumericKind(1) },

    /**
     * Block reference. It represents the last block of the chain the transaction is sent to.
     */
    {
        name: 'blockRef',
        kind: new RLP_CODER.CompactFixedHexBlobKind(8)
    },

    /**
     * Expiration. It represents the expiration date of the transaction.
     */
    { name: 'expiration', kind: new RLP_CODER.NumericKind(4) },

    /**
     * Clauses of the transaction. They represent the actions to be executed by the transaction.
     */
    {
        name: 'clauses',
        kind: {
            item: [
                {
                    name: 'to',
                    kind: new RLP_CODER.OptionalFixedHexBlobKind(20)
                },
                { name: 'value', kind: new RLP_CODER.NumericKind(32) },
                { name: 'data', kind: new RLP_CODER.HexBlobKind() }
            ]
        }
    },

    /**
     * Gas price coef. It represents the gas price coefficient of the transaction.
     */
    { name: 'gasPriceCoef', kind: new RLP_CODER.NumericKind(1) },

    /**
     * Gas. It represents the gas limit of the transaction.
     */
    { name: 'gas', kind: new RLP_CODER.NumericKind(8) },

    /**
     * Depends on. It represents the hash of the transaction the current transaction depends on.
     */
    { name: 'dependsOn', kind: new RLP_CODER.OptionalFixedHexBlobKind(32) },

    /**
     * Nonce. It represents the nonce of the transaction.
     */
    { name: 'nonce', kind: new RLP_CODER.NumericKind(8) },

    /**
     * Reserved. It represents the reserved field of the transaction.
     */
    { name: 'reserved', kind: { item: new RLP_CODER.BufferKind() } }
];

/**
 * Kind for transaction features
 * @internal
 */
const TRANSACTION_FEATURES_KIND = {
    name: 'reserved.features',
    kind: new RLP_CODER.NumericKind(4)
};

/**
 * Kind for transaction signature
 * @internal
 */
const TRANSACTION_SIGNATURE_KIND = {
    name: 'signature',
    kind: new RLP_CODER.BufferKind()
};

/**
 * RLP_CODER profiler for simple unsigned transactions
 * @internal
 */
const UNSIGNED_TRANSACTION_RLP = new RLP_CODER.Profiler({
    name: 'tx',
    kind: TRANSACTION_FIELDS
});

/**
 * RLP_CODER profiler for simple signed transactions
 * @internal
 */
const SIGNED_TRANSACTION_RLP = new RLP_CODER.Profiler({
    name: 'tx',

    // Add signature to the transaction fields
    kind: TRANSACTION_FIELDS.concat([TRANSACTION_SIGNATURE_KIND])
});

/**
 * Signature length
 * @internal
 */
const SIGNATURE_LENGTH = 65;

/**
 * Block ref field length
 * @internal
 */
const BLOCK_REF_LENGTH = 8;

export {
    TRANSACTIONS_GAS_CONSTANTS,
    UNSIGNED_TRANSACTION_RLP,
    SIGNED_TRANSACTION_RLP,
    TRANSACTION_FEATURES_KIND,
    TRANSACTION_SIGNATURE_KIND,
    SIGNATURE_LENGTH,
    BLOCK_REF_LENGTH
};
