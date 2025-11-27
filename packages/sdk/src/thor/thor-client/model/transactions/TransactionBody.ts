import { type Hex } from '@common/vcdm';
import { type Clause } from './Clause';

/**
 * Core transaction body interface.
 * Contains all fields required by thor except the signature.
 */
interface TransactionBody {
    /**
     * The last byte of the genesis block ID.
     */
    chainTag: number;

    /**
     * The first 8 bytes of the referenced block ID.
     */
    blockRef: Hex;

    /**
     * The expiration of the transaction, represented as the number of blocks after the blockRef
     */
    expiration: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    clauses: Clause[];

    /**
     * The max amount of gas that can be used by the transaction.
     */
    gas: bigint;

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     * Used for legacy transactions (pre-EIP-1559).
     * Mutually exclusive with maxFeePerGas and maxPriorityFeePerGas.
     */
    gasPriceCoef?: bigint;

    /**
     * The maximum fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * Used for dynamic fee transactions.
     * Mutually exclusive with gasPriceCoef.
     */
    maxFeePerGas?: bigint;

    /**
     * The maximum priority fee per gas the sender is willing to pay (EIP-1559 dynamic fees).
     * This is the tip paid to validators for transaction inclusion priority.
     * Used for dynamic fee transactions.
     * Mutually exclusive with gasPriceCoef.
     */
    maxPriorityFeePerGas?: bigint;

    /**
     * The transaction ID that this transaction depends on.
     */
    dependsOn: Hex | null;

    /**
     * The transaction nonce - a 64-bit unsigned integer.
     */
    nonce: bigint;

    /**
     * The reserved field for the transaction.
     */
    reserved?: {
        features?: number;
        unused?: Uint8Array[];
    };
}

/**
 * Options for `buildTransactionBody` method to build a transaction body.
 * Contains all fields to build a transaction body
 * This is the same as the TransactionBody but:
 * - All fields are optional
 * - No clauses field
 * - The reserved field is replaced with a isDelegated field for easier usage
 */
interface TransactionBodyOptions {
    /**
     * 8 bytes prefix of some block's ID
     */
    blockRef?: Hex;

    /**
     * Last byte of genesis block ID
     */
    chainTag?: number;

    /**
     * The ID of the transaction that this transaction depends on.
     */
    dependsOn?: Hex;

    /**
     * The expiration time of the transaction.
     * The transaction will expire after the number of blocks specified by this value.
     */
    expiration?: number;

    /**
     * The maximum amount of gas to allow this transaction to consume.
     */
    gas?: bigint;

    /**
     * Coefficient used to calculate the gas price for the transaction.
     * Value must be between 0 and 255.
     */
    gasPriceCoef?: bigint;

    /**
     * Whether the transaction is delegated to another account for gas payment.
     */
    isDelegated?: boolean;

    /**
     * Nonce value for various purposes.
     * Basic is to prevent replay attack by make transaction unique.
     * Every transaction with same chainTag, blockRef, ... must have different nonce.
     */
    nonce?: bigint;

    /**
     * The maximum fee per gas for the transaction.
     */
    maxFeePerGas?: bigint;

    /**
     * The maximum priority fee per gas for the transaction.
     */
    maxPriorityFeePerGas?: bigint;
}

export type { TransactionBody, TransactionBodyOptions };
