import * as nc_utils from '@noble/curves/abstract/utils';
import { Address, Hex, HexUInt, Units, VTHO } from '../vcdm';
import { Blake2b256 } from '../vcdm/hash/Blake2b256';
import { Secp256k1 } from '../secp256k1';
import { RLP_CODER, type RLPValidObject } from '../encoding';
import { type TransactionBody } from './TransactionBody';
import {
    InvalidDataType,
    InvalidSecp256k1PrivateKey,
    InvalidSecp256k1Signature,
    InvalidTransactionField,
    NotDelegatedTransaction,
    UnavailableTransactionField
} from '@vechain/sdk-errors';
import type { TransactionClause } from './TransactionClause';

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
        TX_GAS: 5000,
        CLAUSE_GAS: 16000,
        CLAUSE_GAS_CONTRACT_CREATION: 48000,
        ZERO_GAS_DATA: 4,
        NON_ZERO_GAS_DATA: 68
    };

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
    private static readonly RLP_FIELDS = [
        { name: 'chainTag', kind: new RLP_CODER.NumericKind(1) },
        { name: 'blockRef', kind: new RLP_CODER.CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new RLP_CODER.NumericKind(4) },
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
        { name: 'gasPriceCoef', kind: new RLP_CODER.NumericKind(1) },
        { name: 'gas', kind: new RLP_CODER.NumericKind(8) },
        { name: 'dependsOn', kind: new RLP_CODER.OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new RLP_CODER.NumericKind(8) },
        { name: 'reserved', kind: { item: new RLP_CODER.BufferKind() } }
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
        kind: new RLP_CODER.NumericKind(4)
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
        kind: new RLP_CODER.BufferKind()
    };

    /**
     * Represents a Recursive Length Prefix (RLP) of the signed transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNED_TRANSACTION = new RLP_CODER.Profiler({
        name: 'tx',
        kind: Transaction.RLP_FIELDS.concat([Transaction.RLP_SIGNATURE])
    });

    /**
     * Represents a Recursive Length Prefix (RLP) of the unsigned transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_UNSIGNED_TRANSACTION = new RLP_CODER.Profiler({
        name: 'tx',
        kind: Transaction.RLP_FIELDS
    });

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
     * Get the delegator's address if the transaction is delegated.
     *
     * If the transaction is delegated and a signature is available, this method recovers
     * the delegator parameter from the signature and subsequently recovers the delegator's public key
     * to derive the delegator's address.
     *
     * @return {Address} The address of the delegator.
     * @throws {UnavailableTransactionField} If the transaction is delegated but the signature is missing.
     * @throws {NotDelegatedTransaction} If the transaction is not delegated.
     *
     * @remarks Security auditable method, depends on
     * - {@link Address.ofPublicKey};
     * - {@link Secp256k1.recover};
     * - {@link Transaction.getSignatureHash}.
     */
    public get delegator(): Address {
        if (this.isDelegated) {
            if (this.signature !== undefined) {
                // Recover the delegator param from the signature
                const delegator = this.signature.slice(
                    Secp256k1.SIGNATURE_LENGTH,
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
     * Get the encoded bytes as a Uint8Array.
     * The encoding is determined by whether the data is signed.
     *
     * @return {Uint8Array} The encoded byte array.
     *
     * @see decode
     */
    public get encoded(): Uint8Array {
        return this._encode(this.isSigned);
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
        return Transaction.intrinsicGas(this.body.clauses);
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
                    this.getSignatureHash().bytes,
                    // Get the (r, s) of ECDSA digital signature without delegator params.
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
        // Get correct decoder profiler
        const decoder = isSigned
            ? Transaction.RLP_SIGNED_TRANSACTION
            : Transaction.RLP_UNSIGNED_TRANSACTION;
        // Get decoded body
        // todo: remove Buffer after #1120
        const decodedRLPBody = decoder.decodeObject(
            Buffer.from(rawTransaction)
        ) as RLPValidObject;
        // Create correct transaction body without reserved field
        const bodyWithoutReservedField: TransactionBody = {
            blockRef: decodedRLPBody.blockRef as string,
            chainTag: decodedRLPBody.chainTag as number,
            clauses: decodedRLPBody.clauses as [],
            dependsOn: decodedRLPBody.dependsOn as string | null,
            expiration: decodedRLPBody.expiration as number,
            gas: decodedRLPBody.gas as number,
            gasPriceCoef: decodedRLPBody.gasPriceCoef as number,
            nonce: decodedRLPBody.nonce as number
        };
        // Create correct transaction body (with correct reserved field)
        // todo: remove Buffer after #1120
        const correctTransactionBody: TransactionBody =
            (decodedRLPBody.reserved as Buffer[]).length > 0
                ? {
                      ...bodyWithoutReservedField,
                      reserved: Transaction._decodeReservedField(
                          decodedRLPBody.reserved as Buffer[]
                      )
                  }
                : bodyWithoutReservedField;
        // Return decoded transaction (with signature or not)
        // todo: remove Buffer after #1120
        return decodedRLPBody.signature !== undefined
            ? Transaction.of(
                  correctTransactionBody,
                  decodedRLPBody.signature as Buffer
              )
            : Transaction.of(correctTransactionBody);
    }

    /**
     * Computes the signature hash, optionally incorporating a delegator's address.
     *
     * @param {Address} [delegator] - Optional delegator's address to include in the hash computation.
     * @return {Blake2b256} - The computed signature hash.
     *
     * @remarks
     * `delegator` is used to sign a transaction on behalf of another account.
     *
     * @remarks Security auditable method, depends on
     * - {@link Blake2b256.of}.
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
     * Calculates the intrinsic gas required for the given transaction clauses.
     *
     * @param {TransactionClause[]} clauses - An array of transaction clauses to calculate the intrinsic gas for.
     * @return {VTHO} The total intrinsic gas required for the provided clauses.
     */
    public static intrinsicGas(clauses: TransactionClause[]): VTHO {
        if (clauses.length > 0) {
            // Some clauses.
            return VTHO.of(
                clauses.reduce((sum: number, clause: TransactionClause) => {
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
                    sum += Transaction._computeUsedGasFor(clause.data);
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
     * Return `true` if the transaction body is valid, `false` otherwise.
     *
     * @param {TransactionBody} body - The transaction body to validate.
     * @return {boolean} `true` if the transaction body is valid, `false` otherwise.
     */
    public static isValidBody(body: TransactionBody): boolean {
        return (
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

    /**
     * Creates a new Transaction instance if the provided body and optional
     * signature are valid.
     *
     * @param {TransactionBody} body - The transaction body to be validated.
     * @param {Uint8Array} [signature] - Optional signature to be validated.
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

    /**
     * Signs the transaction using the provided private key.
     *
     * @param {Uint8Array} signerPrivateKey - The private key used to sign the transaction.
     * @return {Transaction} The signed transaction.
     * @throws {InvalidTransactionField} If attempting to sign a delegated transaction.
     * @throws {InvalidSecp256k1PrivateKey} If the provided private key is not valid.
     *
     * @remarks Security auditable method, depends on
     * - {@link Secp256k1.isValidPrivateKey};
     * - {@link Secp256k1.sign}.
     */
    public sign(signerPrivateKey: Uint8Array): Transaction {
        // Check if the private key is valid.
        if (Secp256k1.isValidPrivateKey(signerPrivateKey)) {
            if (!this.isDelegated) {
                // Sign transaction
                const signature = Secp256k1.sign(
                    this.getSignatureHash().bytes,
                    signerPrivateKey
                );
                // Return new signed transaction.
                return Transaction.of(this.body, signature);
            }
            throw new InvalidTransactionField(
                `Transaction.sign`,
                'delegated transaction: use signWithDelegator method',
                { fieldName: 'delegator', body: this.body }
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.sign`,
            'invalid private key: ensure it is a secp256k1 key',
            undefined
        );
    }

    /**
     * Signs the transaction using both the signer and the delegator private keys.
     *
     * @param {Uint8Array} signerPrivateKey - The private key of the signer.
     * @param {Uint8Array} delegatorPrivateKey - The private key of the delegator.
     * @return {Transaction} A new transaction with the concatenated signatures
     * of the signer and the delegator.
     *
     * @remarks Security auditable method, depends on
     * - {@link Address.ofPublicKey}
     * - {@link Secp256k1.isValidPrivateKey};
     * - {@link Secp256k1.sign}.
     */
    public signWithDelegator(
        signerPrivateKey: Uint8Array,
        delegatorPrivateKey: Uint8Array
    ): Transaction {
        // Check if the private key of the signer is valid.
        if (Secp256k1.isValidPrivateKey(signerPrivateKey)) {
            // Check if the private key of the delegator is valid.
            if (Secp256k1.isValidPrivateKey(delegatorPrivateKey)) {
                if (this.isDelegated) {
                    const transactionHash = this.getSignatureHash().bytes;
                    const delegatedHash = this.getSignatureHash(
                        Address.ofPublicKey(
                            Secp256k1.derivePublicKey(signerPrivateKey)
                        )
                    ).bytes;
                    // Return new signed transaction
                    return Transaction.of(
                        this.body,
                        nc_utils.concatBytes(
                            Secp256k1.sign(transactionHash, signerPrivateKey),
                            Secp256k1.sign(delegatedHash, delegatorPrivateKey)
                        )
                    );
                }
                throw new NotDelegatedTransaction(
                    'Transaction.signWithDelegator',
                    'not delegated transaction: use sign method',
                    undefined
                );
            }
            throw new InvalidSecp256k1PrivateKey(
                `Transaction.signWithDelegator`,
                'invalid delegator private: ensure it is a secp256k1 key',
                undefined
            );
        }
        throw new InvalidSecp256k1PrivateKey(
            `Transaction.signWithDelegator`,
            'invalid signer private key: ensure it is a secp256k1 key',
            undefined
        );
    }

    // ********** PRIVATE FUNCTIONS **********

    /**
     * Computes the amount of gas used for the given data.
     *
     * @param {string} data - The hexadecimal string data for which the gas usage is computed.
     * @return {number} The total gas used for the provided data.
     * @throws {InvalidDataType} If the data is not a valid hexadecimal string.
     */
    private static _computeUsedGasFor(data: string): number {
        // Invalid data
        if (data !== '' && !Hex.isValid(data))
            throw new InvalidDataType(
                '_calculateDataUsedGas()',
                `Invalid data type for gas calculation. Data should be a hexadecimal string.`,
                { data }
            );

        let sum = 0;
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
     * @param {Buffer[]} reserved  - An array of Buffer objects representing the reserved field data.
     * @return {Object} An object containing the decoded features and any unused buffer data.
     * @return {number} [return.features] The decoded features from the reserved field.
     * @return {Buffer[]} [return.unused] An array of Buffer objects representing unused data, if any.
     * @throws {InvalidTransactionField} Thrown if the reserved field is not properly trimmed.
     */
    // todo: remove Buffer after #1120
    private static _decodeReservedField(reserved: Buffer[]): {
        features?: number;
        unused?: Buffer[];
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
            'Transaction._decodeReservedField',
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
    private _encode(isSigned: boolean): Uint8Array {
        // Encode transaction body with RLP
        return this._encodeBodyField(
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
                reserved: this._encodeReservedField()
            },
            isSigned
        );
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
    private _encodeBodyField(
        body: RLPValidObject,
        isSigned: boolean
    ): Uint8Array {
        // Encode transaction object - SIGNED
        if (isSigned) {
            // todo: remove Buffer->Uint8Array after #1120
            return new Uint8Array(
                Transaction.RLP_SIGNED_TRANSACTION.encodeObject({
                    ...body,
                    // todo: remove Buffer after #1120
                    signature: Buffer.from(this.signature as Uint8Array)
                })
            );
        }
        // Encode transaction object - UNSIGNED
        // todo: remove Buffer->Uint8Array after #1120
        return new Uint8Array(
            Transaction.RLP_UNSIGNED_TRANSACTION.encodeObject(body)
        );
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
     * @see _encode
     */
    private _encodeReservedField(): Uint8Array[] {
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
    private static _isDelegated(body: TransactionBody): boolean {
        // Check if is reserved or not
        const reserved = body.reserved ?? {};
        // Features
        const features = reserved.features ?? 0;
        // Fashion bitwise way to check if a number is even or not
        return (features & 1) === 1;
    }

    /**
     * Return Returns true if the signature is valid, otherwise false.
     *
     * @param {TransactionBody} body - The transaction body to be checked.
     * @param {Uint8Array} signature - The signature to validate.
     * @return {boolean} - Returns true if the signature is valid, otherwise false.
     */
    private static _isSignatureValid(
        body: TransactionBody,
        signature: Uint8Array
    ): boolean {
        // Verify signature length
        const expectedSignatureLength = this._isDelegated(body)
            ? Secp256k1.SIGNATURE_LENGTH * 2
            : Secp256k1.SIGNATURE_LENGTH;

        return signature.length === expectedSignatureLength;
    }
}

export { Transaction };
