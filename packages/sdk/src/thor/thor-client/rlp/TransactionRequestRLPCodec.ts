import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions/index';
import {
    Address,
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    InvalidEncodingError,
    NumericKind,
    OptionalFixedHexBlobKind,
    RLP,
    type RLPProfile,
    RLPProfiler,
    type RLPValidObject
} from '@common';
import { type TransactionBody } from '../model/transactions/BaseTransaction';

const FQP = 'packages/sdk/src/thor/signer/TransactionRequestRLPCodec.ts!';

/**
 * Class representing a codec for encoding and decoding transaction requests using Recursive Length Prefix (RLP) encoding.
 */

class TransactionRequestRLPCodec {
    /**
     * The prefix for dynamic fee transactions request.
     */
    private static readonly DYNAMIC_FEE_PREFIX = 0x51;

    /**
     * The RLP profile for signed transaction request fields.
     */
    private static readonly RLP_SIGNED_STATE = {
        name: 'signature',
        kind: new BufferKind()
    };

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
     * The RLP profile for an unsigneddynamic fee transaction
     */
    private static readonly RLP_UNSIGNED_DYNAMIC_FEE = [
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
     * The RLP profile for a signed dynamic fee transaction
     */
    private static readonly RLP_SIGNED_DYNAMIC_FEE =
        TransactionRequestRLPCodec.RLP_UNSIGNED_DYNAMIC_FEE.concat(
            TransactionRequestRLPCodec.RLP_SIGNED_STATE
        );

    /**
     * The RLP profile for an unsigned legacy transaction
     */
    private static readonly RLP_UNSIGNED_LEGACY = [
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
     * The RLP profile for a signed legacy transaction
     */
    private static readonly RLP_SIGNED_LEGACY =
        TransactionRequestRLPCodec.RLP_UNSIGNED_LEGACY.concat(
            TransactionRequestRLPCodec.RLP_SIGNED_STATE
        );

    /**
     * Decodes an encoded transaction request into a TransactionRequest object.
     *
     * @param {Uint8Array} encoded - The encoded transaction request as a Uint8Array.
     * @return {TransactionRequest} The decoded transaction request.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    public static decode(encoded: Uint8Array): TransactionRequest {
        // Check if this is a dynamic fee transaction by looking for prefix
        const isDynamicFee =
            encoded.length > 0 &&
            encoded[0] === TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX;
        // Remove the transaction type prefix if present
        const encodedData = isDynamicFee ? encoded.slice(1) : encoded;
        return isDynamicFee
            ? TransactionRequestRLPCodec.decodeDynamicFee(encodedData)
            : TransactionRequestRLPCodec.decodeLegacy(encodedData);
    }

    /**
     * Decodes the given RLPValidObject into a {@link TransactionBodyForRLP} object.
     *
     * @param {RLPValidObject} decoded - The object containing the encoded transaction data to decode.
     * @return {TransactionBodyForRLP} The decoded TransactionBodyForRLP object containing all transaction details.
     */
    private static decodeBody(decoded: RLPValidObject): TransactionBodyForRLP {
        const clauses: Array<{
            to: string | null;
            value: bigint;
            data: string;
        }> = (decoded.clauses as RLPValidObject[]).map(
            (decodedClause: RLPValidObject) => ({
                to: (decodedClause.to as string) ?? null,
                value: BigInt(decodedClause.value as string),
                data: (decodedClause.data as string) ?? Hex.PREFIX
            })
        );
        return {
            blockRef: decoded.blockRef as string,
            chainTag: decoded.chainTag as number,
            clauses,
            dependsOn:
                decoded.dependsOn === null
                    ? null
                    : (decoded.dependsOn as string),
            expiration: decoded.expiration as number,
            gas: BigInt(decoded.gas as number),
            gasPriceCoef:
                decoded.gasPriceCoef !== null &&
                decoded.gasPriceCoef !== undefined
                    ? BigInt(decoded.gasPriceCoef as number)
                    : undefined,
            maxFeePerGas:
                decoded.maxFeePerGas !== undefined &&
                decoded.maxFeePerGas !== null
                    ? BigInt(decoded.maxFeePerGas as bigint)
                    : undefined,
            maxPriorityFeePerGas:
                decoded.maxPriorityFeePerGas !== undefined &&
                decoded.maxPriorityFeePerGas !== null
                    ? BigInt(decoded.maxPriorityFeePerGas as bigint)
                    : undefined,
            nonce: decoded.nonce as bigint,
            reserved: decoded.reserved as Uint8Array[],
            signature: decoded.signature as Uint8Array
        } satisfies TransactionBodyForRLP;
    }

    /**
     * Decodes a dynamic fee transaction request from its encoded representation.
     *
     * @param {Uint8Array} encoded - The encoded dynamic fee transaction request.
     * @return {TransactionRequest} The decoded transaction request object.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    private static decodeDynamicFee(encoded: Uint8Array): TransactionRequest {
        const rlpProfile = TransactionRequestRLPCodec.getRLPProfile(
            encoded,
            TransactionRequestRLPCodec.RLP_SIGNED_DYNAMIC_FEE,
            TransactionRequestRLPCodec.RLP_UNSIGNED_DYNAMIC_FEE,
            `${FQP}TransactionRequestRLPCodec.decode(encoded: Uint8Array): TransactionRequest`
        );

        const decoded = RLPProfiler.ofObjectEncoded(encoded, rlpProfile)
            .object as RLPValidObject;
        const body = TransactionRequestRLPCodec.decodeBody(decoded);

        return TransactionRequestRLPCodec.mapBodyToTransactionRequest(body);
    }

    /**
     * Decodes a legacy transaction request from the provided encoded data.
     *
     * @param {Uint8Array} encoded The encoded transaction data to be decoded.
     * @return {TransactionRequest} The decoded transaction request object.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    private static decodeLegacy(encoded: Uint8Array): TransactionRequest {
        const rlpProfile = TransactionRequestRLPCodec.getRLPProfile(
            encoded,
            TransactionRequestRLPCodec.RLP_SIGNED_LEGACY,
            TransactionRequestRLPCodec.RLP_UNSIGNED_LEGACY,
            `${FQP}TransactionRequestRLPCodec.decode(encoded: Uint8Array): TransactionRequest`
        );

        const decoded = RLPProfiler.ofObjectEncoded(encoded, rlpProfile)
            .object as RLPValidObject;
        const body = TransactionRequestRLPCodec.decodeBody(decoded);

        return TransactionRequestRLPCodec.mapBodyToTransactionRequest(body);
    }

    /**
     * Encodes a given transaction request into a RLP serialized format.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be encoded.
     * @param {boolean} [isToHash=false] - Specifies whether the encoded output should be prepared for hashing.
     *        If true, the encoding ignore the `signature` field and only encodes the `clauses` and `reserved` fields.
     *        If false, the encoding includes the `signature` field.
     * @return {Uint8Array} The serialized and encoded transaction request.
     */
    public static encode(
        transactionRequest: TransactionRequest,
        isToHash: boolean = false
    ): Uint8Array {
        const body = {
            ...TransactionRequestRLPCodec.mapTransactionRequestToTransactionBodyForRLP(
                transactionRequest
            )
        } satisfies TransactionBodyForRLP;
        if (transactionRequest.isDynamicFee) {
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([
                TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX,
                ...RLPProfiler.ofObject(body, {
                    name: 'tx',
                    kind: isToHash
                        ? TransactionRequestRLPCodec.RLP_UNSIGNED_DYNAMIC_FEE
                        : transactionRequest.signature !== undefined
                          ? TransactionRequestRLPCodec.RLP_SIGNED_DYNAMIC_FEE
                          : TransactionRequestRLPCodec.RLP_UNSIGNED_DYNAMIC_FEE
                }).encoded
            ]);
        }
        return RLPProfiler.ofObject(body, {
            name: 'tx',
            kind: isToHash
                ? TransactionRequestRLPCodec.RLP_UNSIGNED_LEGACY
                : transactionRequest.signature !== undefined
                  ? TransactionRequestRLPCodec.RLP_SIGNED_LEGACY
                  : TransactionRequestRLPCodec.RLP_UNSIGNED_LEGACY
        }).encoded;
    }

    /**
     * Processes and retrieves the appropriate RLP profile based on the sizes of the signed and unsigned requests.
     *
     * @param {Uint8Array} encoded - The encoded data to be processed.
     * @param {RLPProfile[]} signedRequest - Array of signed requests used for determining the profile match if the sizes align.
     * @param {RLPProfile[]} unsignedRequest - Array of unsigned requests used for determining the profile match if the sizes align.
     * @param {string} fqn - The full qualified name of the invoking method used for error reporting.
     * @return {RLPProfile} The matched RLP profile based on the size comparison, or throws an error if no match is found.
     * @throws {InvalidEncodingError} If the sizes of the provided requests do not match the expected encoded data size.
     */
    private static getRLPProfile(
        encoded: Uint8Array,
        signedRequest: RLPProfile[],
        unsignedRequest: RLPProfile[],
        fqn: string
    ): RLPProfile {
        const size = (RLP.ofEncoded(encoded).decoded as unknown[]).length;
        if (signedRequest.length === size) {
            return { name: 'tx', kind: signedRequest } satisfies RLPProfile;
        } else if (unsignedRequest.length === size) {
            return { name: 'tx', kind: unsignedRequest } satisfies RLPProfile;
        } else {
            throw new InvalidEncodingError(
                fqn,
                `invalid encoded transaction request`
            );
        }
    }

    /**
     * Maps the provided body object into a TransactionRequest object.
     *
     * @param {Body} body - The input body containing transaction details, including clauses, chain information, signatures, and related parameters.
     * @return {TransactionRequest} A TransactionRequest object created from the input body, containing transaction details and signatures.
     */
    private static mapBodyToTransactionRequest(
        body: TransactionBodyForRLP
    ): TransactionRequest {
        // Convert clause data back to Clause objects.
        const clauses: Clause[] = body.clauses.map((clauseData) => {
            return new Clause(
                clauseData.to !== null ? Address.of(clauseData.to) : null,
                clauseData.value,
                clauseData.data !== Hex.PREFIX ? Hex.of(clauseData.data) : null
            );
        });
        // Create TransactionRequestParam object.
        const params = {
            blockRef: Hex.of(body.blockRef),
            chainTag: body.chainTag,
            clauses,
            dependsOn: body.dependsOn !== null ? Hex.of(body.dependsOn) : null,
            expiration: body.expiration,
            gas: body.gas,
            gasPriceCoef: body.gasPriceCoef,
            nonce: body.nonce,
            maxFeePerGas: body.maxFeePerGas,
            maxPriorityFeePerGas: body.maxPriorityFeePerGas,
            reserved:
                body.reserved !== undefined
                    ? TransactionRequestRLPCodec.decodeReservedField(
                          body.reserved
                      )
                    : undefined
        } satisfies TransactionBody;
        // Create and return TransactionRequest with signatures.
        return new TransactionRequest(params, body.signature);
    }

    /**
     * Maps a TransactionRequest object to a {@link Body} object for transaction creation.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request containing all necessary properties such as clauses, gas, signature, and more.
     * @return {Body} A object that represents the structured transaction data ready for RLP encoding.
     */
    private static mapTransactionRequestToTransactionBodyForRLP(
        transactionRequest: TransactionRequest
    ): TransactionBodyForRLP {
        const clauses: Array<{
            to: string | null;
            value: bigint;
            data: string;
        }> = transactionRequest.clauses.map(
            (
                clause: Clause
            ): { to: string | null; value: bigint; data: string } => {
                return {
                    to: clause.to?.toString() ?? null,
                    value: clause.value,
                    data: clause.data?.toString() ?? Hex.PREFIX
                };
            }
        );
        const baseBody = {
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses,
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            nonce: transactionRequest.nonce,
            reserved:
                TransactionRequestRLPCodec.encodeReservedField(
                    transactionRequest
                ),
            signature: transactionRequest.signature
        } satisfies TransactionBodyForRLP;

        // For dynamic fee transactions, use maxFeePerGas and maxPriorityFeePerGas
        if (transactionRequest.isDynamicFee) {
            return {
                ...baseBody,
                maxFeePerGas: transactionRequest.maxFeePerGas,
                maxPriorityFeePerGas: transactionRequest.maxPriorityFeePerGas
            } satisfies TransactionBodyForRLP;
        }

        // For legacy transactions (type 0), use gasPriceCoef
        return {
            ...baseBody,
            gasPriceCoef: transactionRequest.gasPriceCoef
        } satisfies TransactionBodyForRLP;
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
    private static encodeReservedField(
        transactionRequest: TransactionRequest
    ): Uint8Array[] {
        // Check if is reserved or not
        const reserved = transactionRequest.reserved ?? {};
        // Init kind for features
        const featuresKind = TransactionRequestRLPCodec.RLP_FEATURES.kind;
        // Features list
        const featuresList = [
            featuresKind
                .data(
                    reserved.features ?? 0,
                    TransactionRequestRLPCodec.RLP_FEATURES.name
                )
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
        if (reserved.length === 0) {
            return { features: 0, unused: [] };
        }
        // Not trimmed reserved field
        if (reserved[reserved.length - 1].length > 0) {
            // Get features field.
            const featuresField = TransactionRequestRLPCodec.RLP_FEATURES.kind
                .buffer(
                    reserved[0],
                    TransactionRequestRLPCodec.RLP_FEATURES.name
                )
                .decode() as number;
            // Return encoded reserved field
            return reserved.length > 1
                ? {
                      features: featuresField,
                      unused: reserved.slice(1)
                  }
                : { features: featuresField };
        }
        throw new InvalidEncodingError(
            `TransactionRequestRLPCodec.decodeReservedField`,
            'invalid reserved field: fields in the `reserved` property must be properly trimmed',
            { fieldName: 'reserved', reserved }
        );
    }
}

/**
 * Interface representing a TransactionBody for RLP encoding/decoding only.
 * Used for RLP encoding/decoding only, hence using only
 * All fields are JS primitive types.
 * @remarks Not intended to be exported.
 */
interface TransactionBodyForRLP {
    blockRef: string;
    chainTag: number;
    clauses: Array<{
        to: string | null;
        value: bigint;
        data: string;
    }>;
    dependsOn: string | null;
    expiration: number;
    gas: bigint;
    gasPriceCoef?: bigint; // Optional for dynamic fee transactions
    nonce: bigint;
    maxFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    maxPriorityFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    reserved?: Uint8Array[]; // For VIP-191 transactions, having one element = 1 to flag the transaction as intended to be sponsored.
    signature?: Uint8Array;
}

export { TransactionRequestRLPCodec };
