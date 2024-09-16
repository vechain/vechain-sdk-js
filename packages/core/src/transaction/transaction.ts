import { Address, Hex } from '../vcdm';
import { Blake2b256 } from '../vcdm/hash/Blake2b256';
import {
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';
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
import { type TransactionBody } from './types';

/**
 * Represents an immutable transaction entity.
 *
 * @remarks
 * Properties should be treated as read-only to avoid unintended side effects.
 * Any modifications create a new transaction instance which should be handled by the TransactionHandler component.
 *
 * @see {@link TransactionHandler} for transaction manipulation details.
 */
class Transaction {
    /**
     * Transaction body. It represents the body of the transaction.
     *
     * @note It is better to take it as a read-only property in order to avoid any external modification.
     */
    public readonly body: TransactionBody;

    /**
     * Transaction signature. It represents the signature of the transaction.
     *
     * @note It is better to take it as a read-only property in order to avoid any external modification.
     */
    public readonly signature?: Buffer;

    /**
     * Constructor with parameters.
     * This constructor creates a transaction immutable object.
     *
     * @param body - Transaction body
     * @param signature - Optional signature for the transaction
     * @throws {InvalidTransactionField, InvalidSecp256k1Signature}
     */
    constructor(body: TransactionBody, signature?: Buffer) {
        // Body
        if (!Transaction.isValidBody(body)) {
            throw new InvalidTransactionField(
                'Transaction constructor',
                'Invalid transaction body. Ensure all required fields are correctly formatted and present.',
                { fieldName: 'body', body }
            );
        }

        this.body = body;

        // User passed a signature
        if (signature !== undefined && !this._isSignatureValid(signature)) {
            throw new InvalidSecp256k1Signature(
                'Transaction constructor',
                'Invalid transaction signature. Ensure it is correctly formatted.',
                { signature }
            );
        }

        this.signature = signature;
    }

    // ********** PUBLIC GET ONLY FUNCTIONS **********

    /**
     * Calculate intrinsic gas required for this transaction
     *
     * @returns Intrinsic gas required for this transaction
     */
    public get intrinsicGas(): number {
        return TransactionUtils.intrinsicGas(this.body.clauses);
    }

    /**
     * Determines whether the transaction is delegated.
     *
     * @returns If transaction is delegated or not
     */
    public get isDelegated(): boolean {
        return this._isDelegated(this.body);
    }

    /**
     * Get transaction delegator address from signature.
     *
     * @returns Transaction delegator address
     * @throws {NotDelegatedTransaction, UnavailableTransactionField}
     */
    public get delegator(): string {
        // Undelegated transaction
        if (!this.isDelegated)
            throw new NotDelegatedTransaction(
                'Transaction.delegator()',
                'Transaction is not delegated. Delegate information is unavailable.',
                undefined
            );

        // Unsigned transaction (@note we don't check if signature is valid or not, because we have checked it into constructor at creation time)
        if (!this.isSigned)
            throw new UnavailableTransactionField(
                'Transaction.delegator()',
                "Transaction is not signed. 'delegator' information is unavailable.",
                { fieldName: 'delegator' }
            );

        // Slice signature needed to recover public key
        // Obtains the recovery param from the signature
        const signatureSliced = (this.signature as Buffer).subarray(
            65,
            this.signature?.length
        );

        // Recover public key
        const delegatorPublicKey = Secp256k1.recover(
            this.getSignatureHash(this.origin),
            signatureSliced
        );

        // Address from public key
        return Address.ofPublicKey(Buffer.from(delegatorPublicKey)).toString();
    }

    /**
     * Determines whether the transaction is signed or not.
     *
     * @returns If transaction is signed or not
     */
    public get isSigned(): boolean {
        return this.signature !== undefined;
    }

    /**
     * Computes the signature hash for the transaction. The output is based on
     * the presence of the 'delegateFor' parameter.
     *
     * @param delegateFor - Optional address of the delegator.
     * @returns The computed hash.
     *
     * Mainly:
     *  - No 'delegateFor': return txHash
     * - 'delegateFor' return txHash +  hash('delegateFor' address)
     *
     * @remarks
     * delegateFor is used to sign a transaction on behalf of another account.
     * In fact when the delegator sign the transaction, delegator will add the address
     * of who send the transaction to sign (in this case the 'delegateFor' address parameter)
     *
     * @example
     * A is transaction origin
     * B is the delegator
     * TX is the transaction
     *
     * A sends a TX (signed by A) to B to who add his signature to TX using delegateFor parameter (that is A address)
     * on signing hash of TX computation.
     *
     * Mathematically:
     *
     * ```
     * final_signature = concat_buffer(
     *      sign(TX.signingHash(), A.privateKey),
     *      sign(TX.signingHash(A.address), B.privateKey)
     * )
     * ```
     *
     * Where:
     *
     * ```
     * TX.signatureHash() = blake2b256(TX.encoded)
     * TX.signingHash(A.address) = blake2b256(
     *      concat(
     *              blake2b256(TX.encoded),
     *              A.address
     *             )
     * )
     * ```
     *
     * @param delegateFor - Address of the delegator
     * @returns Signing hash of the transaction
     * @throws {InvalidTransactionField}
     */
    public getSignatureHash(delegateFor?: string): Buffer {
        // Correct delegateFor address
        if (delegateFor !== undefined && !Address.isValid(delegateFor)) {
            throw new InvalidTransactionField(
                'Transaction.getSignatureHash()',
                'Invalid address given as input as delegateFor parameter. Ensure it is a valid address.',
                { fieldName: 'delegateFor', delegateFor }
            );
        }

        // Encode transaction
        const transactionHash = Blake2b256.of(this._encode(false)).bytes;

        // There is a delegateFor address (@note we already know that it is a valid address)
        if (delegateFor !== undefined) {
            return Buffer.from(
                Blake2b256.of(
                    Buffer.concat([
                        Buffer.from(transactionHash),
                        Buffer.from(delegateFor.slice(2), 'hex')
                    ])
                ).bytes
            );
        }

        return Buffer.from(transactionHash);
    }

    /**
     * Encode a transaction
     *
     * @returns The transaction encoded
     */
    public get encoded(): Buffer {
        return this._encode(this.isSigned);
    }

    /**
     * Get transaction origin address from signature.
     *
     * @returns Transaction origin
     * @throws {UnavailableTransactionField}
     */
    public get origin(): string {
        // Unsigned transaction (@note we don't check if signature is valid or not, because we have checked it into constructor at creation time)
        if (!this.isSigned)
            throw new UnavailableTransactionField(
                'Transaction.origin()',
                "Transaction is not signed. 'origin' information is unavailable.",
                { fieldName: 'origin' }
            );

        // Slice signature
        // Obtains the concatenated signature (r, s) of ECDSA digital signature
        const signatureSliced = (this.signature as Buffer).subarray(0, 65);

        // Recover public key
        const originPublicKey = Secp256k1.recover(
            this.getSignatureHash(),
            signatureSliced
        );

        // Address from public key
        return Address.ofPublicKey(Buffer.from(originPublicKey)).toString();
    }

    /**
     * Get transaction ID from signature.
     *
     * @returns Transaction ID
     * @throws {UnavailableTransactionField}
     */
    get id(): string {
        // Unsigned transaction (@note we don't check if signature is valid or not, because we have checked it into constructor at creation time)
        if (!this.isSigned)
            throw new UnavailableTransactionField(
                'Transaction.id()',
                "Transaction is not signed. 'id' information is unavailable.",
                { fieldName: 'id' }
            );

        // Return transaction ID
        return Blake2b256.of(
            Buffer.concat([
                this.getSignatureHash(),
                Buffer.from(this.origin.slice(2), 'hex')
            ])
        ).toString();
    }

    // ********** INTERNAL PRIVATE FUNCTIONS **********

    /**
     * Internal function to check if transaction is delegated or not.
     * This function is used to check directly the transaction body.
     * @private
     *
     * @param body Transaction body to check
     * @returns Weather the transaction is delegated or not
     */
    private _isDelegated(body: TransactionBody): boolean {
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
    private _isSignatureValid(signature: Buffer): boolean {
        // Verify signature length
        const expectedSignatureLength = this._isDelegated(this.body)
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
    private _encodeReservedField(): Buffer[] {
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
    ): Buffer {
        // Encode transaction object - SIGNED
        if (isSigned) {
            return SIGNED_TRANSACTION_RLP.encodeObject({
                ...body,
                signature: this.signature
            });
        }

        // Encode transaction object - UNSIGNED
        return UNSIGNED_TRANSACTION_RLP.encodeObject(body);
    }

    /**
     * Private utility function to encode a transaction.
     * @private
     *
     * @param isSigned If transaction is signed or not (needed to determine if encoding with SIGNED_TRANSACTION_RLP or UNSIGNED_TRANSACTION_RLP)
     * @returns Encoding of transaction
     */
    private _encode(isSigned: boolean): Buffer {
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
            Buffer.from(body.blockRef.slice(2), 'hex').length ===
                BLOCK_REF_LENGTH &&
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
