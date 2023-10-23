import { RLP } from '../../encoding';

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
    {
        name: 'blockRef',
        kind: new RLP.CompactFixedHexBlobKind(8)
    },

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
                { name: 'to', kind: new RLP.OptionalFixedHexBlobKind(20) },
                { name: 'value', kind: new RLP.NumericKind(32) },
                { name: 'data', kind: new RLP.HexBlobKind() }
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
    { name: 'dependsOn', kind: new RLP.OptionalFixedHexBlobKind(32) },

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
 * Kind for transaction features
 * @public
 */
const TRANSACTION_FEATURES_KIND = {
    name: 'reserved.features',
    kind: new RLP.NumericKind(4)
};

/**
 * Kind for transaction signature
 */
const TRANSACTION_SIGNATURE_KIND = {
    name: 'signature',
    kind: new RLP.BufferKind()
};

/**
 * RLP profiler for simple signed transactions
 * @public
 */
const SIGNED_TRANSACTION_RLP = new RLP.Profiler({
    name: 'tx',

    // Add signature to the transaction fields
    kind: TRANSACTION_FIELDS.concat([TRANSACTION_SIGNATURE_KIND])
});

/**
 * Signature length
 */
const SIGNATURE_LENGTH = 65;

export {
    TRANSACTIONS_GAS_CONSTANTS,
    UNSIGNED_TRANSACTION_RLP,
    SIGNED_TRANSACTION_RLP,
    TRANSACTION_FEATURES_KIND,
    TRANSACTION_SIGNATURE_KIND,
    SIGNATURE_LENGTH
};
