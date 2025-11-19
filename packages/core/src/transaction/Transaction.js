"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const nc_utils = __importStar(require("@noble/curves/abstract/utils"));
const sdk_errors_1 = require("@vechain/sdk-errors");
const secp256k1_1 = require("../secp256k1");
const vcdm_1 = require("../vcdm");
const Blake2b256_1 = require("../vcdm/hash/Blake2b256");
const TransactionType_1 = require("./TransactionType");
/**
 * Represents an immutable transaction entity.
 */
class Transaction {
    /**
     * Represent the block reference length in bytes.
     */
    static BLOCK_REF_LENGTH = 8;
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
    static GAS_CONSTANTS = {
        TX_GAS: 5000n,
        CLAUSE_GAS: 16000n,
        CLAUSE_GAS_CONTRACT_CREATION: 48000n,
        ZERO_GAS_DATA: 4n,
        NON_ZERO_GAS_DATA: 68n
    };
    /**
     * Represents the prefix for raw EIP-1559 transaction type.
     */
    static EIP1559_TX_TYPE_PREFIX = 0x51;
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
    static LEGACY_RLP_FIELDS = [
        { name: 'chainTag', kind: new vcdm_1.NumericKind(1) },
        { name: 'blockRef', kind: new vcdm_1.CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new vcdm_1.NumericKind(4) },
        {
            name: 'clauses',
            kind: {
                item: [
                    {
                        name: 'to',
                        kind: new vcdm_1.OptionalFixedHexBlobKind(20)
                    },
                    { name: 'value', kind: new vcdm_1.NumericKind(32) },
                    { name: 'data', kind: new vcdm_1.HexBlobKind() }
                ]
            }
        },
        { name: 'gasPriceCoef', kind: new vcdm_1.NumericKind(1) },
        { name: 'gas', kind: new vcdm_1.NumericKind(8) },
        { name: 'dependsOn', kind: new vcdm_1.OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new vcdm_1.NumericKind(8) },
        { name: 'reserved', kind: { item: new vcdm_1.BufferKind() } }
    ];
    /**
     * Represents the RLP fields for EIP-1559 transactions.
     */
    static EIP1559_RLP_FIELDS = [
        { name: 'chainTag', kind: new vcdm_1.NumericKind(1) },
        { name: 'blockRef', kind: new vcdm_1.CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new vcdm_1.NumericKind(4) },
        {
            name: 'clauses',
            kind: {
                item: [
                    {
                        name: 'to',
                        kind: new vcdm_1.OptionalFixedHexBlobKind(20)
                    },
                    { name: 'value', kind: new vcdm_1.NumericKind(32) },
                    { name: 'data', kind: new vcdm_1.HexBlobKind() }
                ]
            }
        },
        { name: 'maxPriorityFeePerGas', kind: new vcdm_1.NumericKind(32) },
        { name: 'maxFeePerGas', kind: new vcdm_1.NumericKind(32) },
        { name: 'gas', kind: new vcdm_1.NumericKind(8) },
        { name: 'dependsOn', kind: new vcdm_1.OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new vcdm_1.NumericKind(8) },
        { name: 'reserved', kind: { item: new vcdm_1.BufferKind() } }
    ];
    /**
     * Represent the Recursive Length Prefix (RLP) of the transaction features.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    static RLP_FEATURES = {
        name: 'reserved.features',
        kind: new vcdm_1.NumericKind(4)
    };
    /**
     * Represents a Recursive Length Prefix (RLP) of the transaction signature.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    static RLP_SIGNATURE = {
        name: 'signature',
        kind: new vcdm_1.BufferKind()
    };
    /**
     * Represents a Recursive Length Prefix (RLP) of the signed transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    static RLP_SIGNED_LEGACY_TRANSACTION_PROFILE = {
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
    static RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE = {
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
    static RLP_SIGNED_EIP1559_TRANSACTION_PROFILE = {
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
    static RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE = {
        name: 'tx',
        kind: Transaction.EIP1559_RLP_FIELDS
    };
    /**
     * It represents the content of the transaction.
     */
    body;
    /**
     * It represents the type of the transaction.
     */
    transactionType;
    /**
     * It represents the signature of the transaction content.
     */
    signature;
    /**
     * Creates a new instance of the class with the specified transaction body and optional signature.
     *
     * @param {TransactionBody} body The transaction body to be used.
     * @param {Uint8Array} [signature] The optional signature for the transaction.
     */
    constructor(body, type, signature) {
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
    get gasPayer() {
        if (this.isDelegated) {
            if (this.signature !== undefined) {
                // Recover the gas payer param from the signature
                const gasPayer = this.signature.slice(secp256k1_1.Secp256k1.SIGNATURE_LENGTH, this.signature.length);
                // Recover the gas payer's public key.
                const gasPayerPublicKey = secp256k1_1.Secp256k1.recover(this.getTransactionHash(this.origin).bytes, gasPayer);
                return vcdm_1.Address.ofPublicKey(gasPayerPublicKey);
            }
            throw new sdk_errors_1.UnavailableTransactionField('Transaction.gasPayer()', 'missing gas payer signature', { fieldName: 'gasPayer' });
        }
        throw new sdk_errors_1.NotDelegatedTransaction('Transaction.gasPayer()', 'not delegated transaction', undefined);
    }
    /**
     * Get the encoded bytes as a Uint8Array.
     * The encoding is determined by whether the data is signed.
     *
     * @return {Uint8Array} The encoded byte array.
     *
     * @see decode
     */
    get encoded() {
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
    get id() {
        if (this.isSigned) {
            return Blake2b256_1.Blake2b256.of(nc_utils.concatBytes(this.getTransactionHash().bytes, this.origin.bytes));
        }
        throw new sdk_errors_1.UnavailableTransactionField('Transaction.id()', 'not signed transaction: id unavailable', { fieldName: 'id' });
    }
    /**
     * Return the intrinsic gas required for this transaction.
     *
     * @return {VTHO} The computed intrinsic gas for the transaction.
     */
    get intrinsicGas() {
        return Transaction.intrinsicGas(this.body.clauses);
    }
    /**
     * Returns `true` if the transaction is delegated, otherwise `false`.
     *
     * @return {boolean} `true` if the transaction is delegated,
     * otherwise `false`.
     */
    get isDelegated() {
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
    get isSigned() {
        if (this.signature !== undefined) {
            return Transaction.isSignatureLengthValid(this.body, this.signature);
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
    get origin() {
        if (this.signature !== undefined) {
            return vcdm_1.Address.ofPublicKey(
            // Get the origin public key.
            secp256k1_1.Secp256k1.recover(this.getTransactionHash().bytes, 
            // Get the (r, s) of ECDSA digital signature without gas payer params.
            this.signature.slice(0, secp256k1_1.Secp256k1.SIGNATURE_LENGTH)));
        }
        throw new sdk_errors_1.UnavailableTransactionField('Transaction.origin()', 'not signed transaction, no origin', { fieldName: 'origin' });
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
    static decode(rawTransaction, isSigned) {
        // check prefix to get tx type
        const rawPrefix = rawTransaction[0];
        let txType = TransactionType_1.TransactionType.Legacy;
        if (Number(rawPrefix) === Transaction.EIP1559_TX_TYPE_PREFIX) {
            txType = TransactionType_1.TransactionType.EIP1559;
        }
        // Get correct decoder profiler
        const profile = isSigned
            ? txType === TransactionType_1.TransactionType.Legacy
                ? Transaction.RLP_SIGNED_LEGACY_TRANSACTION_PROFILE
                : Transaction.RLP_SIGNED_EIP1559_TRANSACTION_PROFILE
            : txType === TransactionType_1.TransactionType.Legacy
                ? Transaction.RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE
                : Transaction.RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE;
        // if eip1559, remove prefix
        if (txType === TransactionType_1.TransactionType.EIP1559) {
            rawTransaction = rawTransaction.slice(1);
        }
        // Get decoded body
        const decodedRLPBody = vcdm_1.RLPProfiler.ofObjectEncoded(rawTransaction, profile).object;
        // Create correct transaction body without reserved field
        const bodyWithoutReservedField = {
            blockRef: decodedRLPBody.blockRef,
            chainTag: decodedRLPBody.chainTag,
            clauses: decodedRLPBody.clauses,
            dependsOn: decodedRLPBody.dependsOn,
            expiration: decodedRLPBody.expiration,
            gas: decodedRLPBody.gas,
            nonce: decodedRLPBody.nonce,
            // Handle both legacy and EIP-1559 gas pricing
            ...(decodedRLPBody.gasPriceCoef !== undefined
                ? { gasPriceCoef: decodedRLPBody.gasPriceCoef }
                : {
                    maxFeePerGas: decodedRLPBody.maxFeePerGas,
                    maxPriorityFeePerGas: decodedRLPBody.maxPriorityFeePerGas
                })
        };
        // Create correct transaction body (with correct reserved field)
        const correctTransactionBody = decodedRLPBody.reserved.length > 0
            ? {
                ...bodyWithoutReservedField,
                reserved: Transaction.decodeReservedField(decodedRLPBody.reserved)
            }
            : bodyWithoutReservedField;
        // Return decoded transaction (with signature or not)
        return decodedRLPBody.signature !== undefined
            ? Transaction.of(correctTransactionBody, decodedRLPBody.signature)
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
    getTransactionHash(sender) {
        const txHash = Blake2b256_1.Blake2b256.of(this.encode(false));
        if (sender !== undefined) {
            return Blake2b256_1.Blake2b256.of(nc_utils.concatBytes(txHash.bytes, sender.bytes));
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
    static intrinsicGas(clauses) {
        if (clauses.length > 0) {
            // Some clauses.
            return vcdm_1.VTHO.of(clauses.reduce((sum, clause) => {
                if (clause.to !== null) {
                    // Invalid address or no vet.domains name
                    if (!vcdm_1.Address.isValid(clause.to) &&
                        !clause.to.includes('.'))
                        throw new sdk_errors_1.InvalidDataType('Transaction.intrinsicGas', 'invalid data type in clause: each `to` field must be a valid address.', { clause });
                    sum += Transaction.GAS_CONSTANTS.CLAUSE_GAS;
                }
                else {
                    sum +=
                        Transaction.GAS_CONSTANTS
                            .CLAUSE_GAS_CONTRACT_CREATION;
                }
                sum += Transaction.computeUsedGasFor(clause.data);
                return sum;
            }, Transaction.GAS_CONSTANTS.TX_GAS), vcdm_1.Units.wei);
        }
        // No clauses.
        return vcdm_1.VTHO.of(Transaction.GAS_CONSTANTS.TX_GAS +
            Transaction.GAS_CONSTANTS.CLAUSE_GAS, vcdm_1.Units.wei);
    }
    /**
     * Validates the transaction body's fields according to the transaction type.
     *
     * @param {TransactionBody} body - The transaction body to validate.
     * @param {TransactionType} type - The transaction type to validate the body against.
     * @return {boolean} True if the transaction body is valid for the given type.
     */
    static isValidBody(body, type) {
        // Legacy transactions shouldn't have any EIP-1559 parameters
        if (type === TransactionType_1.TransactionType.Legacy &&
            (body.maxFeePerGas !== undefined ||
                body.maxPriorityFeePerGas !== undefined)) {
            return false;
        }
        // EIP-1559 transactions shouldn't have legacy parameters
        if (type === TransactionType_1.TransactionType.EIP1559 &&
            body.gasPriceCoef !== undefined) {
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
            vcdm_1.Hex.isValid0x(body.blockRef) &&
            vcdm_1.HexUInt.of(body.blockRef).bytes.length ===
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
        const isValidEip1559Fields = type === TransactionType_1.TransactionType.EIP1559 &&
            body.maxFeePerGas !== undefined &&
            body.maxPriorityFeePerGas !== undefined &&
            ((typeof body.maxFeePerGas === 'string' &&
                vcdm_1.Hex.isValid0x(body.maxFeePerGas)) ||
                typeof body.maxFeePerGas === 'number') &&
            ((typeof body.maxPriorityFeePerGas === 'string' &&
                vcdm_1.Hex.isValid0x(body.maxPriorityFeePerGas)) ||
                typeof body.maxPriorityFeePerGas === 'number');
        // validate legacy fields
        const isValidLegacyFields = type === TransactionType_1.TransactionType.Legacy && body.gasPriceCoef !== undefined;
        // return true if the transaction body is valid
        if (type === TransactionType_1.TransactionType.EIP1559) {
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
    static getTransactionType(body) {
        if (body.gasPriceCoef !== undefined) {
            return TransactionType_1.TransactionType.Legacy;
        }
        if (body.maxFeePerGas !== undefined &&
            body.maxPriorityFeePerGas !== undefined) {
            return TransactionType_1.TransactionType.EIP1559;
        }
        throw new sdk_errors_1.InvalidTransactionField('Transaction.getTransactionType', 'invalid transaction body', {
            fieldName: 'body',
            body
        });
    }
    /**
     * Creates a new Transaction instance if the provided body is valid.
     *
     * @param {TransactionBody} body - The transaction body to be validated.
     * @param {Uint8Array} [signature] - Optional signature.
     * @return {Transaction} A new Transaction instance if validation is successful.
     * @throws {InvalidTransactionField} If the provided body is invalid.
     */
    static of(body, signature) {
        const txType = Transaction.getTransactionType(body);
        if (Transaction.isValidBody(body, txType)) {
            return new Transaction(body, txType, signature);
        }
        throw new sdk_errors_1.InvalidTransactionField('Transaction.of', 'invalid body', {
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
    sign(senderPrivateKey) {
        // Check if the private key is valid.
        if (secp256k1_1.Secp256k1.isValidPrivateKey(senderPrivateKey)) {
            if (!this.isDelegated) {
                // Sign transaction
                const signature = secp256k1_1.Secp256k1.sign(this.getTransactionHash().bytes, senderPrivateKey);
                // Return new signed transaction.
                return Transaction.of(this.body, signature);
            }
            throw new sdk_errors_1.InvalidTransactionField(`Transaction.sign`, 'delegated transaction: use signAsSenderAndGasPayer method', { fieldName: 'gasPayer', body: this.body });
        }
        throw new sdk_errors_1.InvalidSecp256k1PrivateKey(`Transaction.sign`, 'invalid private key: ensure it is a secp256k1 key', undefined);
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
    signAsGasPayer(sender, gasPayerPrivateKey) {
        if (secp256k1_1.Secp256k1.isValidPrivateKey(gasPayerPrivateKey)) {
            if (this.isDelegated) {
                const senderHash = this.getTransactionHash(sender).bytes;
                if (this.signature !== undefined) {
                    return new Transaction(this.body, this.transactionType, nc_utils.concatBytes(
                    // Drop any previous gas payer signature.
                    this.signature.slice(0, secp256k1_1.Secp256k1.SIGNATURE_LENGTH), secp256k1_1.Secp256k1.sign(senderHash, gasPayerPrivateKey)));
                }
                else {
                    return new Transaction(this.body, this.transactionType, secp256k1_1.Secp256k1.sign(senderHash, gasPayerPrivateKey));
                }
            }
            throw new sdk_errors_1.NotDelegatedTransaction('Transaction.signAsGasPayer', 'not delegated transaction: use sign method', undefined);
        }
        throw new sdk_errors_1.InvalidSecp256k1PrivateKey(`Transaction.signAsGasPayer`, 'invalid gas payer private key: ensure it is a secp256k1 key', undefined);
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
    signAsSender(senderPrivateKey) {
        if (secp256k1_1.Secp256k1.isValidPrivateKey(senderPrivateKey)) {
            if (this.isDelegated) {
                const transactionHash = this.getTransactionHash().bytes;
                return new Transaction(this.body, this.transactionType, secp256k1_1.Secp256k1.sign(transactionHash, senderPrivateKey));
            }
            throw new sdk_errors_1.NotDelegatedTransaction('Transaction.signAsSender', 'not delegated transaction: use sign method', undefined);
        }
        throw new sdk_errors_1.InvalidSecp256k1PrivateKey(`Transaction.signAsSender`, 'invalid sender private key: ensure it is a secp256k1 key', undefined);
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
    signAsSenderAndGasPayer(senderPrivateKey, gasPayerPrivateKey) {
        // Check if the private key of the sender is valid.
        if (secp256k1_1.Secp256k1.isValidPrivateKey(senderPrivateKey)) {
            // Check if the private key of the gas payer is valid.
            if (secp256k1_1.Secp256k1.isValidPrivateKey(gasPayerPrivateKey)) {
                if (this.isDelegated) {
                    const senderHash = this.getTransactionHash().bytes;
                    const gasPayerHash = this.getTransactionHash(vcdm_1.Address.ofPublicKey(secp256k1_1.Secp256k1.derivePublicKey(senderPrivateKey))).bytes;
                    // Return new signed transaction
                    return Transaction.of(this.body, nc_utils.concatBytes(secp256k1_1.Secp256k1.sign(senderHash, senderPrivateKey), secp256k1_1.Secp256k1.sign(gasPayerHash, gasPayerPrivateKey)));
                }
                throw new sdk_errors_1.NotDelegatedTransaction('Transaction.signAsSenderAndGasPayer', 'not delegated transaction: use sign method', undefined);
            }
            throw new sdk_errors_1.InvalidSecp256k1PrivateKey(`Transaction.signAsSenderAndGasPayer`, 'invalid gas payer private key: ensure it is a secp256k1 key', undefined);
        }
        throw new sdk_errors_1.InvalidSecp256k1PrivateKey(`Transaction.signAsSenderAndGasPayer`, 'invalid sender private key: ensure it is a secp256k1 key', undefined);
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
    static computeUsedGasFor(data) {
        // Invalid data
        if (data !== '' && !vcdm_1.Hex.isValid(data))
            throw new sdk_errors_1.InvalidDataType('calculateDataUsedGas()', `Invalid data type for gas calculation. Data should be a hexadecimal string.`, { data });
        let sum = 0n;
        for (let i = 2; i < data.length; i += 2) {
            if (data.substring(i, i + 2) === '00') {
                sum += Transaction.GAS_CONSTANTS.ZERO_GAS_DATA;
            }
            else {
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
    static decodeReservedField(reserved) {
        // Not trimmed reserved field
        if (reserved[reserved.length - 1].length > 0) {
            // Get features field.
            const featuresField = Transaction.RLP_FEATURES.kind
                .buffer(reserved[0], Transaction.RLP_FEATURES.name)
                .decode();
            // Return encoded reserved field
            return reserved.length > 1
                ? {
                    features: featuresField,
                    unused: reserved.slice(1)
                }
                : { features: featuresField };
        }
        throw new sdk_errors_1.InvalidTransactionField('Transaction.decodeReservedField', 'invalid reserved field: fields in the `reserved` property must be properly trimmed', { fieldName: 'reserved', reserved });
    }
    /**
     * Encodes the transaction body using RLP encoding.
     *
     * @param {boolean} isSigned - Indicates whether the transaction is signed.
     * @return {Uint8Array} The RLP encoded transaction body.
     *
     * @see encoded
     */
    encode(isSigned) {
        // Encode transaction body with RLP
        const encodedBody = this.encodeBodyField({
            // Existing body and the optional `reserved` field if present.
            ...this.body,
            /*
             * The `body.clauses` property is already an array,
             * albeit TypeScript realize, hence cast is needed
             * otherwise encodeObject will throw an error.
             */
            clauses: this.body.clauses,
            // New reserved field.
            reserved: this.encodeReservedField()
        }, isSigned);
        // add prefix if eip1559
        if (this.transactionType === TransactionType_1.TransactionType.EIP1559) {
            return nc_utils.concatBytes(Uint8Array.from([Transaction.EIP1559_TX_TYPE_PREFIX]), encodedBody);
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
    encodeBodyField(body, isSigned) {
        // Encode transaction object - SIGNED
        if (isSigned) {
            return vcdm_1.RLPProfiler.ofObject({
                ...body,
                signature: Uint8Array.from(this.signature)
            }, this.transactionType === TransactionType_1.TransactionType.EIP1559
                ? Transaction.RLP_SIGNED_EIP1559_TRANSACTION_PROFILE
                : Transaction.RLP_SIGNED_LEGACY_TRANSACTION_PROFILE).encoded;
        }
        // Encode transaction object - UNSIGNED
        return vcdm_1.RLPProfiler.ofObject(body, this.transactionType === TransactionType_1.TransactionType.EIP1559
            ? Transaction.RLP_UNSIGNED_EIP1559_TRANSACTION_PROFILE
            : Transaction.RLP_UNSIGNED_LEGACY_TRANSACTION_PROFILE).encoded;
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
    encodeReservedField() {
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
            }
            else {
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
    static isDelegated(body) {
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
    static isSignatureLengthValid(body, signature) {
        // Verify signature length
        const expectedSignatureLength = this.isDelegated(body)
            ? secp256k1_1.Secp256k1.SIGNATURE_LENGTH * 2
            : secp256k1_1.Secp256k1.SIGNATURE_LENGTH;
        return signature.length === expectedSignatureLength;
    }
}
exports.Transaction = Transaction;
