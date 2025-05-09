import * as nc_utils from '@noble/curves/abstract/utils';
import {
    InvalidDataType,
    InvalidSecp256k1PrivateKey,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';
import { Secp256k1 } from '../secp256k1';
import {
    Address,
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    HexUInt,
    NumericKind,
    OptionalFixedHexBlobKind,
    type RLPProfile,
    RLPProfiler,
    type RLPValidObject,
    Units,
    VTHO
} from '../vcdm';
import { Blake2b256 } from '../vcdm/hash/Blake2b256';
import type { TransactionClause } from './TransactionClause';
import { TransactionType } from './TransactionType';
import { type TransactionBody } from './TransactionBody';

/**
 * Represents an immutable transaction entity.
 */
class Transaction {
    /**
     * Represent the block reference length in bytes.
     */
    private static readonly BLOCK_REF_LENGTH = 8;

    /**
     * A collection of constants used for gas calculations in transactions.
     *
     * Properties
     * - `TX_GAS` - The base gas cost for a transaction.
     * - `CLAUSE_GAS` - The gas cost for executing a clause in a transaction.
     * - `CLAUSE_GAS_CONTRACT_CREATION` - The gas cost for creating a contract via a clause.
     * - `ZERO_GAS_DATA` - The gas cost for transmitting zero bytes of data.
     * - `NON_ZERO_GAS_DATA` - The gas cost for transmitting non-zero bytes of data.
     */
    public static readonly GAS_CONSTANTS = {
        TX_GAS: 5000n,
        CLAUSE_GAS: 16000n,
        CLAUSE_GAS_CONTRACT_CREATION: 48000n,
        ZERO_GAS_DATA: 4n,
        NON_ZERO_GAS_DATA: 68n
    };

    /**
     * Represents the prefix for raw EIP-1559 transaction type.
     */
    private static readonly EIP1559_TX_TYPE_PREFIX = 0x51;

    /**
     * RLP_FIELDS is an array of objects that defines the structure and encoding scheme
     * for various components in a transaction using Recursive Length Prefix (RLP) encoding.
     * Each object in the array represents a field in the transaction, specifying its name and kind.
     * The `kind` attribute is an instance of an RLP coder that determines how the field is encoded.
     *
     * Properties
     * - `chainTag` - Represent the id of the chain the transaction is sent to.
     * - `blockRef` - Represent the last block of the chain the transaction is sent to.
     * - `expiration` -  Represent the expiration date of the transaction.
     * - `clauses` - List of clause objects, each containing:
     *   - `to` - Represent the destination of the transaction.
     *   - `value` - Represent the 'wei' quantity (VET or VTHO) value the transaction is worth.
     *   - `data` - Represent the content of the transaction.
     * - `gasPriceCoef` - Represent the gas price coefficient of the transaction.
     * - `gas` - Represent the gas limit of the transaction.
     * - `dependsOn` - Represent the hash of the transaction the current transaction depends on.
     * - `nonce` - Represent the nonce of the transaction.
     * - `reserved` -  Reserved field.
     */
    private static readonly LEGACY_RLP_FIELDS = [
        { name: 'chainTag', kind: new NumericKind(1) },
        { name: 'blockRef', kind: new CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new NumericKind(4) },
        {
            name: 'clauses',
            kind: {
                item: [
                    {
                        name: 'to',
                        kind: new OptionalFixedHexBlobKind(20)
                    },
                    { name: 'value', kind: new NumericKind(32) },
                    { name: 'data', kind: new HexBlobKind() }
                ]
            }
        },
        { name: 'gasPriceCoef', kind: new NumericKind(1) },
        { name: 'gas', kind: new NumericKind(8) },
        { name: 'dependsOn', kind: new OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new NumericKind(8) },
        { name: 'reserved', kind: { item: new BufferKind() } }
    ];

    /**
     * Represents the RLP fields for EIP-1559 transactions.
     */
    private static readonly EIP1559_RLP_FIELDS = [
        { name: 'chainTag', kind: new NumericKind(1) },
        { name: 'blockRef', kind: new CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new NumericKind(4) },
        {
            name: 'clauses',
            kind: {
                item: [
                    {
                        name: 'to',
                        kind: new OptionalFixedHexBlobKind(20)
                    },
                    { name: 'value', kind: new NumericKind(32) },
                    { name: 'data', kind: new HexBlobKind() }
                ]
            }
        },
        { name: 'maxPriorityFeePerGas', kind: new NumericKind(32) },
        { name: 'maxFeePerGas', kind: new NumericKind(32) },
        { name: 'gas', kind: new NumericKind(8) },
        { name: 'dependsOn', kind: new OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new NumericKind(8) },
        { name: 'reserved', kind: { item: new BufferKind() } }
    ];

    /**
     * Represent the Recursive Length Prefix (RLP) of the transaction features.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_FEATURES = {
        name: 'reserved.features',
        kind: new NumericKind(4)
    };

    /**
     * Represents a Recursive Length Prefix (RLP) of the transaction signature.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNATURE = {
        name: 'signature',
        kind: new BufferKind()
    };

    /**
     * Represents a Recursive Length Prefix (RLP) of the signed transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNED_LEGACY_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: Transaction.LEGACY_RLP_FIELDS.concat([
                Transaction.RLP_SIGNATURE
            ])
        };

    /**
     * Represents a Recursive Length Prefix (RLP) of the unsigned transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: Transaction.LEGACY_RLP_FIELDS
        };

    /**
     * Represents a Recursive Length Prefix (RLP) of the signed EIP-1559 transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNED_EIP1559_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: Transaction.EIP1559_RLP_FIELDS.concat([
                Transaction.RLP_SIGNATURE
            ])
        };

    /**
     * Represents a Recursive Length Prefix (RLP) of the unsigned EIP-1559 transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: Transaction.EIP1559_RLP_FIELDS
        };

    /**
     * It represents the content of the transaction.
     */
    public readonly body: TransactionBody;

    /**
     * It represents the type of the transaction.
     */
    public readonly transactionType: TransactionType;

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
    protected constructor(
        body: TransactionBody,
        type: TransactionType,
        signature?: Uint8Array
    ) {
        this.body = body;
        this.transactionType = type;
        this.signature = signature;
    }

    // ********** GET COMPUTED PROPERTIES **********

    /**
     * Get the gas payer's address if the transaction is delegated.
     *
     * If the transaction is delegated and a signature is available, this method recovers
     * the gas payer parameter from the signature and subsequently recovers the gas payer's public key
     * to derive the gas payer's address.
     *
     * @return {Address} The address of the gas payer.
     * @throws {UnavailableTransactionField} If the transaction is delegated but the signature is missing.
     * @throws {NotDelegatedTransaction} If the transaction is not delegated.
     *
     * @remarks Security auditable method, depends on
     * - {@link Address.ofPublicKey};
     * - {@link Secp256k1.recover};
     * - {@link Transaction.getTransactionHash}.
     */
    public get gasPayer(): Address {
        if (this.isDelegated) {
            if (this.signature !== undefined) {
                // Recover the gas payer param from the signature
                const gasPayer = this.signature.slice(
                    Secp256k1.SIGNATURE_LENGTH,
                    this.signature.length
                );
                // Recover the gas payer's public key.
                const gasPayerPublicKey = Secp256k1.recover(
                    this.getTransactionHash(this.origin).bytes,
                    gasPayer
                );
                return Address.ofPublicKey(gasPayerPublicKey);
            }
            throw new UnavailableTransactionField(
                'Transaction.gasPayer()',
                'missing gas payer signature',
                { fieldName: 'gasPayer' }
            );
        }
        throw new NotDelegatedTransaction(
            'Transaction.gasPayer()',
            'not delegated transaction',
            undefined
        );
    }

    /**
     * Get the encoded bytes as a Uint8Array.
     * The encoding is determined by whether the data is signed.
     *
     * @return {Uint8Array} The encoded byte array.
     *
     * @see decode
     */
    public get encoded(): Uint8Array {
        return this.encode(this.isSigned);
    }

    /**
     * Get transaction ID.
     *
     * The ID is the Blake2b256 hash of the transaction's signature
     * concatenated with the origin's address.
     * If the transaction is not signed,
     * it throws an UnavailableTransactionField error.
     *
     * @return {Blake2b256} The concatenated hash of the signature
     * and origin if the transaction is signed.
     * @throws {UnavailableTransactionField} If the transaction is not signed.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of}
     */
    public get id(): Blake2b256 {
        if (this.isSigned) {
            return Blake2b256.of(
                nc_utils.concatBytes(
                    this.getTransactionHash().bytes,
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
        return Transaction.intrinsicGas(this.body.clauses);
    }

    /**
     * Returns `true` if the transaction is delegated, otherwise `false`.
     *
     * @return {boolean} `true` if the transaction is delegated,
     * otherwise `false`.
     */
    public get isDelegated(): boolean {
        return Transaction.isDelegated(this.body);
    }

    /**
     * Return `true` if the signature is defined and complete, otherwise `false`.
     *
     * @return {boolean} return `true` if the signature is defined and complete, otherwise `false`.
     *
     * @remarks Any delegated transaction signed with {@link signAsSender}
     * but not yet signed with {@link signAsGasPayer} is not signed.
     */
    public get isSigned(): boolean {
        if (this.signature !== undefined) {
            return Transaction.isSignatureLengthValid(
                this.body,
                this.signature
            );
        }
        return false;
    }

    /**
     * Return the origin (also known as sender) address of the transaction.
     *
     * The origin is determined by recovering the public key from the transaction's sender.
     *
     * @return {Address} The address derived from the public key of the transaction's sender.
     * @throws {UnavailableTransactionField} If the transaction is not signed, an exception is thrown indicating the absence of the origin field.
     *
     * @remarks Security auditable method, depends on
     * - {@link Address.ofPublicKey};
     * - {@link Secp256k1.recover}.
     */
    public get origin(): Address {
        if (this.signature !== undefined) {
            return Address.ofPublicKey(
                // Get the origin public key.
                Secp256k1.recover(
                    this.getTransactionHash().bytes,
                    // Get the (r, s) of ECDSA digital signature without gas payer params.
                    this.signature.slice(0, Secp256k1.SIGNATURE_LENGTH)
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
     * Decodes a raw transaction byte array into a new Transaction object.
     *
     * @param {Uint8Array} rawTransaction - The raw transaction bytes to decode.
     * @param {boolean} isSigned - Flag indicating if the transaction is signed.
     * @return {Transaction} The decoded transaction object.
     *
     * @see encoded
     */
    public static decode(
        rawTransaction: Uint8Array,
        isSigned: boolean
    ): Transaction {
        // check prefix to get tx type
        const rawPrefix = rawTransaction[0];
        let txType: TransactionType = TransactionType.Legacy;
        if (Number(rawPrefix) === Transaction.EIP1559_TX_TYPE_PREFIX) {
            txType = TransactionType.EIP1559;
        }

        // Get correct decoder profiler
        const profile = isSigned
            ? txType === TransactionType.Legacy
                ? Transaction.RLP_SIGNED_LEGACY_TRANSACTION_PROFILE
                : Transaction.RLP_SIGNED_EIP1559_TRANSACTION_PROFILE
            : txType === TransactionType.Legacy
              ? Transaction.RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE
              : Transaction.RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE;

        // if eip1559, remove prefix
        if (txType === TransactionType.EIP1559) {
            rawTransaction = rawTransaction.slice(1);
        }

        // Get decoded body
        const decodedRLPBody = RLPProfiler.ofObjectEncoded(
            rawTransaction,
            profile
        ).object as RLPValidObject;
        // Create correct transaction body without reserved field
        const bodyWithoutReservedField: TransactionBody = {
            blockRef: decodedRLPBody.blockRef as string,
            chainTag: decodedRLPBody.chainTag as number,
            clauses: decodedRLPBody.clauses as [],
            dependsOn: decodedRLPBody.dependsOn as string | null,
            expiration: decodedRLPBody.expiration as number,
            gas: decodedRLPBody.gas as number,
            nonce: decodedRLPBody.nonce as number,
            // Handle both legacy and EIP-1559 gas pricing
            ...(decodedRLPBody.gasPriceCoef !== undefined
                ? { gasPriceCoef: decodedRLPBody.gasPriceCoef as number }
                : {
                      maxFeePerGas: decodedRLPBody.maxFeePerGas as string,
                      maxPriorityFeePerGas:
                          decodedRLPBody.maxPriorityFeePerGas as string
                  })
        };
        // Create correct transaction body (with correct reserved field)
        const correctTransactionBody: TransactionBody =
            (decodedRLPBody.reserved as Uint8Array[]).length > 0
                ? {
                      ...bodyWithoutReservedField,
                      reserved: Transaction.decodeReservedField(
                          decodedRLPBody.reserved as Uint8Array[]
                      )
                  }
                : bodyWithoutReservedField;
        // Return decoded transaction (with signature or not)
        return decodedRLPBody.signature !== undefined
            ? Transaction.of(
                  correctTransactionBody,
                  decodedRLPBody.signature as Uint8Array
              )
            : Transaction.of(correctTransactionBody);
    }

    /**
     * Computes the transaction hash, optionally incorporating a gas payer's address.
     *
     * @param {Address} [sender] - Optional transaction origin's address to include in the hash computation.
     * @return {Blake2b256} - The computed transaction hash.
     *
     * @remarks
     * `sender` is used to sign a transaction on behalf of another account.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of}.
     */
    public getTransactionHash(sender?: Address): Blake2b256 {
        const txHash = Blake2b256.of(this.encode(false));
        if (sender !== undefined) {
            return Blake2b256.of(
                nc_utils.concatBytes(txHash.bytes, sender.bytes)
            );
        }
        return txHash;
    }

    /**
     * Calculates the intrinsic gas required for the given transaction clauses.
     *
     * @param {TransactionClause[]} clauses - An array of transaction clauses to calculate the intrinsic gas for.
     * @return {VTHO} The total intrinsic gas required for the provided clauses.
     * @throws {InvalidDataType} If clauses have invalid data as invalid addresses.
     */
    public static intrinsicGas(clauses: TransactionClause[]): VTHO {
        if (clauses.length > 0) {
            // Some clauses.
            return VTHO.of(
                clauses.reduce((sum: bigint, clause: TransactionClause) => {
                    if (clause.to !== null) {
                        // Invalid address or no vet.domains name
                        if (
                            !Address.isValid(clause.to) &&
                            !clause.to.includes('.')
                        )
                            throw new InvalidDataType(
                                'Transaction.intrinsicGas',
                                'invalid data type in clause: each `to` field must be a valid address.',
                                { clause }
                            );

                        sum += Transaction.GAS_CONSTANTS.CLAUSE_GAS;
                    } else {
                        sum +=
                            Transaction.GAS_CONSTANTS
                                .CLAUSE_GAS_CONTRACT_CREATION;
                    }
                    sum += Transaction.computeUsedGasFor(clause.data);
                    return sum;
                }, Transaction.GAS_CONSTANTS.TX_GAS),
                Units.wei
            );
        }
        // No clauses.
        return VTHO.of(
            Transaction.GAS_CONSTANTS.TX_GAS +
                Transaction.GAS_CONSTANTS.CLAUSE_GAS,
            Units.wei
        );
    }

    /**
     * Validates the transaction body's fields according to the transaction type.
     *
     * @param {TransactionBody} body - The transaction body to validate.
     * @param {TransactionType} type - The transaction type to validate the body against.
     * @return {boolean} True if the transaction body is valid for the given type.
     */
    public static isValidBody(
        body: TransactionBody,
        type: TransactionType
    ): boolean {
        // Legacy transactions shouldn't have any EIP-1559 parameters
        if (
            type === TransactionType.Legacy &&
            (body.maxFeePerGas !== undefined ||
                body.maxPriorityFeePerGas !== undefined)
        ) {
            return false;
        }

        // EIP-1559 transactions shouldn't have legacy parameters
        if (
            type === TransactionType.EIP1559 &&
            body.gasPriceCoef !== undefined
        ) {
            return false;
        }

        // validate common fields
        const isValidCommonFields =
            // Chain tag
            body.chainTag !== undefined &&
            body.chainTag >= 0 &&
            body.chainTag <= 255 &&
            // Block reference
            body.blockRef !== undefined &&
            Hex.isValid0x(body.blockRef) &&
            HexUInt.of(body.blockRef).bytes.length ===
                Transaction.BLOCK_REF_LENGTH &&
            // Expiration
            body.expiration !== undefined &&
            // Clauses
            body.clauses !== undefined &&
            // Gas
            body.gas !== undefined &&
            // Depends on
            body.dependsOn !== undefined &&
            // Nonce
            body.nonce !== undefined;

        // validate eip1559 fields
        const isValidEip1559Fields =
            type === TransactionType.EIP1559 &&
            body.maxFeePerGas !== undefined &&
            body.maxPriorityFeePerGas !== undefined &&
            ((typeof body.maxFeePerGas === 'string' &&
                Hex.isValid0x(body.maxFeePerGas)) ||
                typeof body.maxFeePerGas === 'number') &&
            ((typeof body.maxPriorityFeePerGas === 'string' &&
                Hex.isValid0x(body.maxPriorityFeePerGas)) ||
                typeof body.maxPriorityFeePerGas === 'number');

        // validate legacy fields
        const isValidLegacyFields =
            type === TransactionType.Legacy && body.gasPriceCoef !== undefined;

        // return true if the transaction body is valid
        if (type === TransactionType.EIP1559) {
            return isValidCommonFields && isValidEip1559Fields;
        }
        return isValidCommonFields && isValidLegacyFields;
    }

    /**
     * Returns the type of the transaction.
     *
     * @param {TransactionBody} body - The transaction body to get the type of.
     * @return {TransactionType} The type of the transaction.
     */
    private static getTransactionType(body: TransactionBody): TransactionType {
        if (body.gasPriceCoef !== undefined) {
            return TransactionType.Legacy;
        }
        if (
            body.maxFeePerGas !== undefined &&
            body.maxPriorityFeePerGas !== undefined
        ) {
            return TransactionType.EIP1559;
        }
        throw new InvalidTransactionField(
            'Transaction.getTransactionType',
            'invalid transaction body',
            {
                fieldName: 'body',
                body
            }
        );
    }

    /**
     * Creates a new Transaction instance if the provided body is valid.
     *
     * @param {TransactionBody} body - The transaction body to be validated.
     * @param {Uint8Array} [signature] - Optional signature.
     * @return {Transaction} A new Transaction instance if validation is successful.
     * @throws {InvalidTransactionField} If the provided body is invalid.
     */
    public static of(
        body: TransactionBody,
        signature?: Uint8Array
    ): Transaction {
        const txType = Transaction.getTransactionType(body);
        if (Transaction.isValidBody(body, txType)) {
            return new Transaction(body, txType, signature);
        }
        throw new InvalidTransactionField('Transaction.of', 'invalid body', {
            fieldName: 'body',
            body
        });
    }

    /**
     * Signs the transaction using the provided private key of the transaction sender.
     *
     * @param {Uint8Array} senderPrivateKey - The private key used to sign the transaction.
     * @return {Transaction} The signed transaction.
     * @throws {InvalidTransactionField} If attempting to sign a delegated transaction.
     * @throws {InvalidSecp256k1PrivateKey} If the provided private key is not valid.
     *
     * @remarks Security auditable method, depends on
     * - {@link Secp256k1.isValidPrivateKey};
     * - {@link Secp256k1.sign}.
     */
    public sign(senderPrivateKey: Uint8Array): Transaction {
        // Check if the private key is valid.
        if (Secp256k1.isValidPrivateKey(senderPrivateKey)) {
            if (!this.isDelegated) {
                // Sign transaction
                const signature = Secp256k1.sign(
                    this.getTransactionHash().bytes,
                    senderPrivateKey
                );
                // Return new signed transaction.
                return Transaction.of(this.body, signature);
            }
            throw new InvalidTransactionField(
                `Transaction.sign`,
                'delegated transaction: use signAsSenderAndGasPayer method',
                { fieldName: 'gasPayer', body: this.body }
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.sign`,
            'invalid private key: ensure it is a secp256k1 key',
            undefined
        );
    }

    /**
     * Signs a transaction as a gas payer using the provided private key. This is applicable only if the transaction
     * has been marked as delegated and already contains the signature of the transaction sender
     * that needs to be extended with the gas payer's signature.
     *
     * @param {Address} sender - The address of the sender for whom the transaction hash is generated.
     * @param {Uint8Array} gasPayerPrivateKey - The private key of the gas payer. Must be a valid secp256k1 key.
     *
     * @return {Transaction} - A new transaction object with the gas payer's signature appended.
     *
     * @throws {InvalidSecp256k1PrivateKey} If the provided gas payer private key is not valid.
     * @throws {InvalidTransactionField} If the transaction is unsigned or lacks a valid signature.
     * @throws {NotDelegatedTransaction} If the transaction is not set as delegated.
     *
     * @remarks Security auditable method, depends on
     * - {@link Secp256k1.isValidPrivateKey};
     * - {@link Secp256k1.sign}.
     */
    public signAsGasPayer(
        sender: Address,
        gasPayerPrivateKey: Uint8Array
    ): Transaction {
        if (Secp256k1.isValidPrivateKey(gasPayerPrivateKey)) {
            if (this.isDelegated) {
                const senderHash = this.getTransactionHash(sender).bytes;
                if (this.signature !== undefined) {
                    return new Transaction(
                        this.body,
                        this.transactionType,
                        nc_utils.concatBytes(
                            // Drop any previous gas payer signature.
                            this.signature.slice(0, Secp256k1.SIGNATURE_LENGTH),
                            Secp256k1.sign(senderHash, gasPayerPrivateKey)
                        )
                    );
                } else {
                    return new Transaction(
                        this.body,
                        this.transactionType,
                        Secp256k1.sign(senderHash, gasPayerPrivateKey)
                    );
                }
            }
            throw new NotDelegatedTransaction(
                'Transaction.signAsGasPayer',
                'not delegated transaction: use sign method',
                undefined
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.signAsGasPayer`,
            'invalid gas payer private key: ensure it is a secp256k1 key',
            undefined
        );
    }

    /**
     * Signs a delegated transaction using the provided transaction sender's private key,
     * call the {@link signAsGasPayer} to complete the signature,
     * before such call {@link isDelegated} returns `true` but
     * {@link isSigned} returns `false`.
     *
     * @param senderPrivateKey The private key of the transaction sender, represented as a Uint8Array. It must be a valid secp256k1 private key.
     * @return A new Transaction object with the signature applied, if the transaction is delegated and the private key is valid.
     * @throws NotDelegatedTransaction if the current transaction is not marked as delegated, instructing to use the regular sign method instead.
     * @throws InvalidSecp256k1PrivateKey if the provided senderPrivateKey is not a valid secp256k1 private key.
     *
     * @remarks Security auditable method, depends on
     * - {@link Secp256k1.isValidPrivateKey};
     * - {@link Secp256k1.sign}.
     */
    public signAsSender(senderPrivateKey: Uint8Array): Transaction {
        if (Secp256k1.isValidPrivateKey(senderPrivateKey)) {
            if (this.isDelegated) {
                const transactionHash = this.getTransactionHash().bytes;
                return new Transaction(
                    this.body,
                    this.transactionType,
                    Secp256k1.sign(transactionHash, senderPrivateKey)
                );
            }
            throw new NotDelegatedTransaction(
                'Transaction.signAsSender',
                'not delegated transaction: use sign method',
                undefined
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.signAsSender`,
            'invalid sender private key: ensure it is a secp256k1 key',
            undefined
        );
    }

    /**
     * Signs the transaction using both the transaction sender and the gas payer private keys.
     *
     * @param {Uint8Array} senderPrivateKey - The private key of the transaction sender.
     * @param {Uint8Array} gasPayerPrivateKey - The private key of the gas payer.
     * @return {Transaction} A new transaction with the concatenated signatures
     * of the transaction sender and the gas payer.
     * @throws {InvalidSecp256k1PrivateKey} - If either the private key of the transaction sender or gas payer is invalid.
     * @throws {NotDelegatedTransaction} - If the transaction is not delegated.
     *
     * @remarks Security auditable method, depends on
     * - {@link Address.ofPublicKey}
     * - {@link Secp256k1.isValidPrivateKey};
     * - {@link Secp256k1.sign}.
     */
    public signAsSenderAndGasPayer(
        senderPrivateKey: Uint8Array,
        gasPayerPrivateKey: Uint8Array
    ): Transaction {
        // Check if the private key of the sender is valid.
        if (Secp256k1.isValidPrivateKey(senderPrivateKey)) {
            // Check if the private key of the gas payer is valid.
            if (Secp256k1.isValidPrivateKey(gasPayerPrivateKey)) {
                if (this.isDelegated) {
                    const senderHash = this.getTransactionHash().bytes;
                    const gasPayerHash = this.getTransactionHash(
                        Address.ofPublicKey(
                            Secp256k1.derivePublicKey(senderPrivateKey)
                        )
                    ).bytes;
                    // Return new signed transaction
                    return Transaction.of(
                        this.body,
                        nc_utils.concatBytes(
                            Secp256k1.sign(senderHash, senderPrivateKey),
                            Secp256k1.sign(gasPayerHash, gasPayerPrivateKey)
                        )
                    );
                }
                throw new NotDelegatedTransaction(
                    'Transaction.signAsSenderAndGasPayer',
                    'not delegated transaction: use sign method',
                    undefined
                );
            }
            throw new InvalidSecp256k1PrivateKey(
                `Transaction.signAsSenderAndGasPayer`,
                'invalid gas payer private key: ensure it is a secp256k1 key',
                undefined
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.signAsSenderAndGasPayer`,
            'invalid sender private key: ensure it is a secp256k1 key',
            undefined
        );
    }

    // ********** PRIVATE FUNCTIONS **********

    /**
     * Computes the amount of gas used for the given data.
     *
     * @param {string} data - The hexadecimal string data for which the gas usage is computed.
     * @return {bigint} The total gas used for the provided data.
     * @throws {InvalidDataType} If the data is not a valid hexadecimal string.
     *
     * @remarks gas value is expressed in {@link Units.wei} unit.
     */
    private static computeUsedGasFor(data: string): bigint {
        // Invalid data
        if (data !== '' && !Hex.isValid(data))
            throw new InvalidDataType(
                'calculateDataUsedGas()',
                `Invalid data type for gas calculation. Data should be a hexadecimal string.`,
                { data }
            );

        let sum = 0n;
        for (let i = 2; i < data.length; i += 2) {
            if (data.substring(i, i + 2) === '00') {
                sum += Transaction.GAS_CONSTANTS.ZERO_GAS_DATA;
            } else {
                sum += Transaction.GAS_CONSTANTS.NON_ZERO_GAS_DATA;
            }
        }
        return sum;
    }

    /**
     * Decodes the {@link TransactionBody.reserved} field from the given buffer array.
     *
     * @param {Buffer[]} reserved  - An array of Uint8Array objects representing the reserved field data.
     * @return {Object} An object containing the decoded features and any unused buffer data.
     * @return {number} [return.features] The decoded features from the reserved field.
     * @return {Buffer[]} [return.unused] An array of Buffer objects representing unused data, if any.
     * @throws {InvalidTransactionField} Thrown if the reserved field is not properly trimmed.
     */
    private static decodeReservedField(reserved: Uint8Array[]): {
        features?: number;
        unused?: Uint8Array[];
    } {
        // Not trimmed reserved field
        if (reserved[reserved.length - 1].length > 0) {
            // Get features field.
            const featuresField = Transaction.RLP_FEATURES.kind
                .buffer(reserved[0], Transaction.RLP_FEATURES.name)
                .decode() as number;
            // Return encoded reserved field
            return reserved.length > 1
                ? {
                      features: featuresField,
                      unused: reserved.slice(1)
                  }
                : { features: featuresField };
        }
        throw new InvalidTransactionField(
            'Transaction.decodeReservedField',
            'invalid reserved field: fields in the `reserved` property must be properly trimmed',
            { fieldName: 'reserved', reserved }
        );
    }

    /**
     * Encodes the transaction body using RLP encoding.
     *
     * @param {boolean} isSigned - Indicates whether the transaction is signed.
     * @return {Uint8Array} The RLP encoded transaction body.
     *
     * @see encoded
     */
    private encode(isSigned: boolean): Uint8Array {
        // Encode transaction body with RLP
        const encodedBody = this.encodeBodyField(
            {
                // Existing body and the optional `reserved` field if present.
                ...this.body,
                /*
                 * The `body.clauses` property is already an array,
                 * albeit TypeScript realize, hence cast is needed
                 * otherwise encodeObject will throw an error.
                 */
                clauses: this.body.clauses as Array<{
                    to: string | null;
                    value: string | number;
                    data: string;
                }>,
                // New reserved field.
                reserved: this.encodeReservedField()
            },
            isSigned
        );
        // add prefix if eip1559
        if (this.transactionType === TransactionType.EIP1559) {
            return nc_utils.concatBytes(
                Uint8Array.from([Transaction.EIP1559_TX_TYPE_PREFIX]),
                encodedBody
            );
        }
        return encodedBody;
    }

    /**
     * Encodes the given transaction body into a Uint8Array, depending on whether
     * the transaction is signed or not.
     *
     * @param body - The transaction object adhering to the RLPValidObject structure.
     * @param isSigned - A boolean indicating if the transaction is signed.
     * @return A Uint8Array representing the encoded transaction.
     *
     * @see encoded
     */
    private encodeBodyField(
        body: RLPValidObject,
        isSigned: boolean
    ): Uint8Array {
        // Encode transaction object - SIGNED
        if (isSigned) {
            return RLPProfiler.ofObject(
                {
                    ...body,
                    signature: Uint8Array.from(this.signature as Uint8Array)
                },
                this.transactionType === TransactionType.EIP1559
                    ? Transaction.RLP_SIGNED_EIP1559_TRANSACTION_PROFILE
                    : Transaction.RLP_SIGNED_LEGACY_TRANSACTION_PROFILE
            ).encoded;
        }
        // Encode transaction object - UNSIGNED
        return RLPProfiler.ofObject(
            body,
            this.transactionType === TransactionType.EIP1559
                ? Transaction.RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE
                : Transaction.RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE
        ).encoded;
    }

    /**
     * Encodes the {@link TransactionBody.reserved} field data for a transaction.
     *
     * @return {Uint8Array[]} The encoded list of reserved features.
     * It removes any trailing unused features that have zero length from the list.
     *
     * @remarks The {@link TransactionBody.reserved} is optional, albeit
     * is required to perform RLP encoding.
     *
     * @see encode
     */
    private encodeReservedField(): Uint8Array[] {
        // Check if is reserved or not
        const reserved = this.body.reserved ?? {};
        // Init kind for features
        const featuresKind = Transaction.RLP_FEATURES.kind;
        // Features list
        const featuresList = [
            featuresKind
                .data(reserved.features ?? 0, Transaction.RLP_FEATURES.name)
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
     * Return `true` if the transaction is delegated, else `false`.
     *
     * @param {TransactionBody} body - The transaction body.
     * @return {boolean} `true` if the transaction is delegated, else `false`.
     */
    private static isDelegated(body: TransactionBody): boolean {
        // Check if is reserved or not
        const reserved = body.reserved ?? {};
        // Features
        const features = reserved.features ?? 0;
        // Fashion bitwise way to check if a number is even or not
        return (features & 1) === 1;
    }

    /**
     * Validates the length of a given signature against the expected length.
     *
     * @param {TransactionBody} body - The body of the transaction being validated.
     * @param {Uint8Array} signature - The signature to verify the length of.
     * @return {boolean} Returns true if the signature length matches the expected length, otherwise false.
     */
    private static isSignatureLengthValid(
        body: TransactionBody,
        signature: Uint8Array
    ): boolean {
        // Verify signature length
        const expectedSignatureLength = this.isDelegated(body)
            ? Secp256k1.SIGNATURE_LENGTH * 2
            : Secp256k1.SIGNATURE_LENGTH;

        return signature.length === expectedSignatureLength;
    }
}

export { Transaction };
