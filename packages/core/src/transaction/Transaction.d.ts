import { Address, VTHO } from '../vcdm';
import { Blake2b256 } from '../vcdm/hash/Blake2b256';
import type { TransactionClause } from './TransactionClause';
import { TransactionType } from './TransactionType';
import { type TransactionBody } from './TransactionBody';
/**
 * Represents an immutable transaction entity.
 */
declare class Transaction {
    /**
     * Represent the block reference length in bytes.
     */
    private static readonly BLOCK_REF_LENGTH;
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
    static readonly GAS_CONSTANTS: {
        TX_GAS: bigint;
        CLAUSE_GAS: bigint;
        CLAUSE_GAS_CONTRACT_CREATION: bigint;
        ZERO_GAS_DATA: bigint;
        NON_ZERO_GAS_DATA: bigint;
    };
    /**
     * Represents the prefix for raw EIP-1559 transaction type.
     */
    private static readonly EIP1559_TX_TYPE_PREFIX;
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
    private static readonly LEGACY_RLP_FIELDS;
    /**
     * Represents the RLP fields for EIP-1559 transactions.
     */
    private static readonly EIP1559_RLP_FIELDS;
    /**
     * Represent the Recursive Length Prefix (RLP) of the transaction features.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_FEATURES;
    /**
     * Represents a Recursive Length Prefix (RLP) of the transaction signature.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNATURE;
    /**
     * Represents a Recursive Length Prefix (RLP) of the signed transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNED_LEGACY_TRANSACTION_PROFILE;
    /**
     * Represents a Recursive Length Prefix (RLP) of the unsigned transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE;
    /**
     * Represents a Recursive Length Prefix (RLP) of the signed EIP-1559 transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_SIGNED_EIP1559_TRANSACTION_PROFILE;
    /**
     * Represents a Recursive Length Prefix (RLP) of the unsigned EIP-1559 transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE;
    /**
     * It represents the content of the transaction.
     */
    readonly body: TransactionBody;
    /**
     * It represents the type of the transaction.
     */
    readonly transactionType: TransactionType;
    /**
     * It represents the signature of the transaction content.
     */
    readonly signature?: Uint8Array;
    /**
     * Creates a new instance of the class with the specified transaction body and optional signature.
     *
     * @param {TransactionBody} body The transaction body to be used.
     * @param {Uint8Array} [signature] The optional signature for the transaction.
     */
    protected constructor(body: TransactionBody, type: TransactionType, signature?: Uint8Array);
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
    get gasPayer(): Address;
    /**
     * Get the encoded bytes as a Uint8Array.
     * The encoding is determined by whether the data is signed.
     *
     * @return {Uint8Array} The encoded byte array.
     *
     * @see decode
     */
    get encoded(): Uint8Array;
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
    get id(): Blake2b256;
    /**
     * Return the intrinsic gas required for this transaction.
     *
     * @return {VTHO} The computed intrinsic gas for the transaction.
     */
    get intrinsicGas(): VTHO;
    /**
     * Returns `true` if the transaction is delegated, otherwise `false`.
     *
     * @return {boolean} `true` if the transaction is delegated,
     * otherwise `false`.
     */
    get isDelegated(): boolean;
    /**
     * Return `true` if the signature is defined and complete, otherwise `false`.
     *
     * @return {boolean} return `true` if the signature is defined and complete, otherwise `false`.
     *
     * @remarks Any delegated transaction signed with {@link signAsSender}
     * but not yet signed with {@link signAsGasPayer} is not signed.
     */
    get isSigned(): boolean;
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
    get origin(): Address;
    /**
     * Decodes a raw transaction byte array into a new Transaction object.
     *
     * @param {Uint8Array} rawTransaction - The raw transaction bytes to decode.
     * @param {boolean} isSigned - Flag indicating if the transaction is signed.
     * @return {Transaction} The decoded transaction object.
     *
     * @see encoded
     */
    static decode(rawTransaction: Uint8Array, isSigned: boolean): Transaction;
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
    getTransactionHash(sender?: Address): Blake2b256;
    /**
     * Calculates the intrinsic gas required for the given transaction clauses.
     *
     * @param {TransactionClause[]} clauses - An array of transaction clauses to calculate the intrinsic gas for.
     * @return {VTHO} The total intrinsic gas required for the provided clauses.
     * @throws {InvalidDataType} If clauses have invalid data as invalid addresses.
     */
    static intrinsicGas(clauses: TransactionClause[]): VTHO;
    /**
     * Validates the transaction body's fields according to the transaction type.
     *
     * @param {TransactionBody} body - The transaction body to validate.
     * @param {TransactionType} type - The transaction type to validate the body against.
     * @return {boolean} True if the transaction body is valid for the given type.
     */
    static isValidBody(body: TransactionBody, type: TransactionType): boolean;
    /**
     * Returns the type of the transaction.
     *
     * @param {TransactionBody} body - The transaction body to get the type of.
     * @return {TransactionType} The type of the transaction.
     */
    private static getTransactionType;
    /**
     * Creates a new Transaction instance if the provided body is valid.
     *
     * @param {TransactionBody} body - The transaction body to be validated.
     * @param {Uint8Array} [signature] - Optional signature.
     * @return {Transaction} A new Transaction instance if validation is successful.
     * @throws {InvalidTransactionField} If the provided body is invalid.
     */
    static of(body: TransactionBody, signature?: Uint8Array): Transaction;
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
    sign(senderPrivateKey: Uint8Array): Transaction;
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
    signAsGasPayer(sender: Address, gasPayerPrivateKey: Uint8Array): Transaction;
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
    signAsSender(senderPrivateKey: Uint8Array): Transaction;
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
    signAsSenderAndGasPayer(senderPrivateKey: Uint8Array, gasPayerPrivateKey: Uint8Array): Transaction;
    /**
     * Computes the amount of gas used for the given data.
     *
     * @param {string} data - The hexadecimal string data for which the gas usage is computed.
     * @return {bigint} The total gas used for the provided data.
     * @throws {InvalidDataType} If the data is not a valid hexadecimal string.
     *
     * @remarks gas value is expressed in {@link Units.wei} unit.
     */
    private static computeUsedGasFor;
    /**
     * Decodes the {@link TransactionBody.reserved} field from the given buffer array.
     *
     * @param {Buffer[]} reserved  - An array of Uint8Array objects representing the reserved field data.
     * @return {Object} An object containing the decoded features and any unused buffer data.
     * @return {number} [return.features] The decoded features from the reserved field.
     * @return {Buffer[]} [return.unused] An array of Buffer objects representing unused data, if any.
     * @throws {InvalidTransactionField} Thrown if the reserved field is not properly trimmed.
     */
    private static decodeReservedField;
    /**
     * Encodes the transaction body using RLP encoding.
     *
     * @param {boolean} isSigned - Indicates whether the transaction is signed.
     * @return {Uint8Array} The RLP encoded transaction body.
     *
     * @see encoded
     */
    private encode;
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
    private encodeBodyField;
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
    private encodeReservedField;
    /**
     * Return `true` if the transaction is delegated, else `false`.
     *
     * @param {TransactionBody} body - The transaction body.
     * @return {boolean} `true` if the transaction is delegated, else `false`.
     */
    private static isDelegated;
    /**
     * Validates the length of a given signature against the expected length.
     *
     * @param {TransactionBody} body - The body of the transaction being validated.
     * @param {Uint8Array} signature - The signature to verify the length of.
     * @return {boolean} Returns true if the signature length matches the expected length, otherwise false.
     */
    private static isSignatureLengthValid;
}
export { Transaction };
//# sourceMappingURL=Transaction.d.ts.map