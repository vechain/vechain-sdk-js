import * as nc_utils from '@noble/curves/abstract/utils';
import { Address, Hex, HexUInt, Units, VTHO } from '../vcdm';
import { Blake2b256 } from '../vcdm/hash/Blake2b256';
import { Secp256k1 } from '../secp256k1';
import {
    BLOCK_REF_LENGTH,
    SIGNATURE_LENGTH,
    SIGNED_TRANSACTION_RLP,
    TRANSACTION_FEATURES_KIND,
    TransactionUtils,
    UNSIGNED_TRANSACTION_RLP
} from '../utils';
import { type RLPValidObject } from '../encoding';
import { type TransactionBody } from './TransactionBody';
import {
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';

/**
 * Represents an immutable transaction entity.
 */
class Transaction {
    private static readonly SIGNATURE_RECOVERY_OFFSET = 65;
    /**
     * It represents the content of the transaction.
     */
    public readonly body: TransactionBody;

    /**
     * It represents the signature of the transaction content.
     */
    public readonly signature?: Uint8Array;

    /**
     * Creates a new instance of the class with the specified transaction body and optional signature.
     *
     * @param {TransactionBody} body The transaction body to be used.
     * @param {Uint8Array} [signature] The optional signature for the transaction.
     */
    protected constructor(body: TransactionBody, signature?: Uint8Array) {
        this.body = body;
        this.signature = signature;
    }

    // ********** GET COMPUTED PROPERTIES **********

    /**
     * Get the encoded bytes as a Uint8Array.
     * The encoding is determined by whether the data is signed.
     *
     * @return {Uint8Array} The encoded byte array.
     */
    public get bytes(): Uint8Array {
        return this._encode(this.isSigned);
    }

    /**
     * Get the delegator's address if the transaction is delegated.
     *
     * If the transaction is delegated and a signature is available, this method recovers
     * the delegator parameter from the signature and subsequently recovers the delegator's public key
     * to derive the delegator's address.
     *
     * @return {Address} The address of the delegator.
     * @throws {UnavailableTransactionField} If the transaction is delegated but the signature is missing.
     * @throws {NotDelegatedTransaction} If the transaction is not delegated.
     */
    public get delegator(): Address {
        if (this.isDelegated) {
            if (this.signature !== undefined) {
                // Recover the delegator param from the signature
                const delegator = this.signature.slice(
                    Transaction.SIGNATURE_RECOVERY_OFFSET,
                    this.signature.length
                );
                // Recover the delegator's public key.
                const delegatorPublicKey = Secp256k1.recover(
                    this.getSignatureHash(this.origin).bytes,
                    delegator
                );
                return Address.ofPublicKey(delegatorPublicKey);
            }
            throw new UnavailableTransactionField(
                'Transaction.delegator()',
                'missing delegator',
                { fieldName: 'delegator' }
            );
        }
        throw new NotDelegatedTransaction(
            'Transaction.delegator()',
            'not delegated transaction',
            undefined
        );
    }

    /**
     * Get transaction ID.
     *
     * The ID is the Blake2b256 hash of the transaction's signature
     * concatenated with the origin's address.
     * If the transaction is not signed,
     * it throws an UnavailableTransactionField error.
     *
     * @return {Blake2b256} The concatenated Blake2b256 hash of the signature
     * and origin if the transaction is signed.
     * @throws {UnavailableTransactionField} If the transaction is not signed.
     */
    public get id(): Blake2b256 {
        if (this.isSigned) {
            return Blake2b256.of(
                nc_utils.concatBytes(
                    this.getSignatureHash().bytes,
                    this.origin.bytes
                )
            );
        }
        throw new UnavailableTransactionField(
            'Transaction.id()',
            'not signed transaction: id unavailable',
            { fieldName: 'id' }
        );
    }

    /**
     * Return the intrinsic gas required for this transaction.
     *
     * @return {VTHO} The computed intrinsic gas for the transaction.
     */
    public get intrinsicGas(): VTHO {
        return VTHO.of(
            TransactionUtils.intrinsicGas(this.body.clauses),
            Units.wei
        );
    }

    /**
     * Returns `true` if the transaction is delegated, otherwise `false`.
     *
     * @return {boolean} `true` if the transaction is delegated,
     * otherwise `false`.
     */
    public get isDelegated(): boolean {
        return Transaction._isDelegated(this.body);
    }

    /**
     * Return `true` if the signature is defined, otherwise `false`.
     *
     * @return {boolean} return `true` if the signature is defined, otherwise `false`.
     */
    public get isSigned(): boolean {
        return this.signature !== undefined;
    }

    /**
     * Return the origin address of the transaction.
     *
     * The origin is determined by recovering the public key from the transaction's signature.
     *
     * @return {Address} The address derived from the public key of the transaction's signer.
     * @throws {UnavailableTransactionField} If the transaction is not signed, an exception is thrown indicating the absence of the origin field.
     */
    public get origin(): Address {
        if (this.signature !== undefined) {
            return Address.ofPublicKey(
                // Get the origin public key.
                Secp256k1.recover(
                    this.getSignatureHash().bytes,
                    // Get the (r, s) of ECDSA digital signature without delegator params.
                    this.signature.slice(
                        0,
                        Transaction.SIGNATURE_RECOVERY_OFFSET
                    )
                )
            );
        }
        throw new UnavailableTransactionField(
            'Transaction.origin()',
            'not signed transaction, no origin',
            { fieldName: 'origin' }
        );
    }

    // ********** PUBLIC METHODS **********

    /**
     * Computes the signature hash, optionally incorporating a delegator's address.
     *
     * @param {Address} [delegator] - Optional delegator's address to include in the hash computation.
     * @return {Blake2b256} - The computed Blake2b256 signature hash.
     *
     * @remarks
     * `delegator` is used to sign a transaction on behalf of another account.
     */
    public getSignatureHash(delegator?: Address): Blake2b256 {
        const txHash = Blake2b256.of(this._encode(false));
        if (delegator !== undefined) {
            return Blake2b256.of(
                nc_utils.concatBytes(txHash.bytes, delegator.bytes)
            );
        }
        return txHash;
    }

    /**
     * Creates a new Transaction instance if the provided body and optional
     * signature are valid.
     *
     * @param {TransactionBody} body The transaction body to be validated.
     * @param {Uint8Array} [signature] Optional signature to be validated.
     * @return {Transaction} A new Transaction instance if validation is successful.
     * @throws {InvalidSecp256k1Signature} If the provided signature is invalid.
     * @throws {InvalidTransactionField} If the provided body is invalid.
     */
    public static of(
        body: TransactionBody,
        signature?: Uint8Array
    ): Transaction {
        if (Transaction.isValidBody(body)) {
            if (
                signature === undefined ||
                Transaction._isSignatureValid(body, signature)
            ) {
                return new Transaction(body, signature);
            }
            throw new InvalidSecp256k1Signature(
                'Transaction.of',
                'invalid signature',
                { signature }
            );
        }
        throw new InvalidTransactionField('Transaction.of', 'invalid body', {
            fieldName: 'body',
            body
        });
    }

    // ********** PRIVATE FUNCTIONS **********

    /**
     * Determines whether a transaction is delegated based on its features.
     *
     * @param {TransactionBody} body The transaction body.
     * @return {boolean} `true` if the transaction is delegated, else `false`.
     */
    private static _isDelegated(body: TransactionBody): boolean {
        // Check if is reserved or not
        const reserved = body.reserved ?? {};

        // Features
        const features = reserved.features ?? 0;

        // Fashion bitwise way to check if a number is even or not
        return (features & 1) === 1;
    }

    /**
     * Internal function to check if signature is valid or not.
     * This function is used to check directly the signature.
     * @private
     *
     * @param signature Signature to check
     * @returns Weather the signature is valid or not
     */
    private static _isSignatureValid(
        body: TransactionBody,
        signature: Uint8Array
    ): boolean {
        // Verify signature length
        const expectedSignatureLength = this._isDelegated(body)
            ? SIGNATURE_LENGTH * 2
            : SIGNATURE_LENGTH;

        return signature.length === expectedSignatureLength;
    }

    /**
     * Encodes the reserved field to ensure it exists in every encoding.
     *
     * Due to the fact that reserved field is optional in TransactionBody,
     * BUT mandatory in RLPProfiler, we need to have it in every encoding.
     * Fot this reason this function is needed.
     * @private
     *
     * @returns Encoding of reserved field
     */
    private _encodeReservedField(): Uint8Array[] {
        // Check if is reserved or not
        const reserved = this.body.reserved ?? {};

        // Init kind for features
        const featuresKind = TRANSACTION_FEATURES_KIND.kind;

        // Features list
        const featuresList = [
            featuresKind
                .data(reserved.features ?? 0, TRANSACTION_FEATURES_KIND.name)
                .encode(),
            ...(reserved.unused ?? [])
        ];

        // Trim features list
        while (featuresList.length > 0) {
            if (featuresList[featuresList.length - 1].length === 0) {
                featuresList.pop();
            } else {
                break;
            }
        }
        return featuresList;
    }

    /**
     * Make the RLP encoding of a transaction body.
     * @private
     *
     * @param body Body to encode
     * @param isSigned If transaction is signed or not
     * @returns RLP encoding of transaction body
     */
    private _lowLevelEncodeTransactionBodyWithRLP(
        body: RLPValidObject,
        isSigned: boolean
    ): Uint8Array {
        // Encode transaction object - SIGNED
        if (isSigned) {
            return new Uint8Array(
                SIGNED_TRANSACTION_RLP.encodeObject({
                    ...body,
                    signature: this.signature
                })
            );
        }

        // Encode transaction object - UNSIGNED
        return new Uint8Array(UNSIGNED_TRANSACTION_RLP.encodeObject(body));
    }

    /**
     * Private utility function to encode a transaction.
     * @private
     *
     * @param isSigned If transaction is signed or not (needed to determine if encoding with SIGNED_TRANSACTION_RLP or UNSIGNED_TRANSACTION_RLP)
     * @returns Encoding of transaction
     */
    private _encode(isSigned: boolean): Uint8Array {
        // Encode transaction body with RLP
        return this._lowLevelEncodeTransactionBodyWithRLP(
            {
                // Existing body (clauses, gasPrice, gasLimit, nonce, chainTag, blockRef, expiration, ... AND OPTIONALLY reserved field)
                ...this.body,

                /*
                 * @note: this.body.clauses is already an array.
                 * But TypeScript doesn't know that and for this reason we need to cast it.
                 * Otherwise encodeObject will throw an error.
                 */
                clauses: this.body.clauses as Array<{
                    to: string | null;
                    value: string | number;
                    data: string;
                }>,

                // New reserved field
                reserved: this._encodeReservedField()
            },
            isSigned
        );
    }

    /**
     * utility function to check transaction body validity.
     *
     * @param body Transaction body to check
     */
    public static isValidBody(body: TransactionBody): boolean {
        // Check if body is valid
        return (
            // Chain tag
            body.chainTag !== undefined &&
            body.chainTag >= 0 &&
            body.chainTag <= 255 &&
            // Block reference
            body.blockRef !== undefined &&
            Hex.isValid0x(body.blockRef) &&
            HexUInt.of(body.blockRef).bytes.length === BLOCK_REF_LENGTH &&
            // Expiration
            body.expiration !== undefined &&
            // Clauses
            body.clauses !== undefined &&
            // Gas price coef
            body.gasPriceCoef !== undefined &&
            // Gas
            body.gas !== undefined &&
            // Depends on
            body.dependsOn !== undefined &&
            // Nonce
            body.nonce !== undefined
        );
    }
}

export { Transaction };
