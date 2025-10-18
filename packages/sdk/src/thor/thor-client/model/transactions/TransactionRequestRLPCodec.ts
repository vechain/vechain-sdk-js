import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions/index';
import {
    Address,
    Blake2b256,
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
    type RLPValidObject,
    Secp256k1
} from '@common'; // eslint-disable-next-line @typescript-eslint/no-extraneous-class

const FQP = 'packages/sdk/src/thor/signer/TransactionRequestRLPCodec.ts!';

/**
 * Class representing a codec for encoding and decoding transaction requests using Recursive Length Prefix (RLP) encoding.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
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
     * The RLP profile for sponsored albeit unsigned transaction request fields.
     */
    private static readonly RLP_UNSIGNED_STATE = [
        { name: 'beggar', kind: new OptionalFixedHexBlobKind(20) },
        { name: 'originSignature', kind: new BufferKind() },
        { name: 'gasPayerSignature', kind: new BufferKind() }
    ];

    /**
     * The RLP profile for the
     * [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)
     * dynamic fee transaction request fields subject to be hashed to compute signatures.
     */
    private static readonly RLP_DYNAMIC_FEE_TO_HASH = [
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
     * The RLP profile for the
     * [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)
     * dynamic fee transaction request once both the gas payer and origin signed.
     *
     * The `signature` field is included,
     * the `gasPayerSignature` and `originSignature` fields are removed.
     */
    private static readonly RLP_DYNAMIC_FEE_SIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_SIGNED_STATE
        );

    /**
     * The RLP profile for the
     * [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559)
     * dynamic fee transaction request while both
     * the gas payer and origin haven't signed yet.
     *
     * The `beggar`, `gasPayerSigture` and `originSignature` fields are included;
     * the `signature` field is removed.
     */
    private static readonly RLP_DYNAMIC_FEE_UNSIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_UNSIGNED_STATE
        );

    /**
     * The RLP profile for the
     * legacy transaction request fields subject to be hashed to compute signatures.
     */
    private static readonly RLP_LEGACY_TO_HASH = [
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
     * The RLP profile for the
     * legacy transaction request once both the gas payer and origin signed.
     *
     * The `signature` field is included,
     * the `gasPayerSignature` and `originSignature` fields are removed.
     */
    private static readonly RLP_LEGACY_SIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_SIGNED_STATE
        );

    /**
     * The RLP profile for the
     * legacy transaction request while both
     * the gas payer and origin haven't signed yet.
     *
     * The `beggar`, `gasPayerSigture` and `originSignature` fields are included;
     * the `signature` field is removed.
     */
    private static readonly RLP_LEGACY_UNSIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_UNSIGNED_STATE
        );

    /**
     * Decodes an encoded transaction request into a TransactionRequest object.
     *
     * @param {Uint8Array} encoded - The encoded transaction request as a Uint8Array.
     * @return {TransactionRequest} The decoded transaction request.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    public static decode(encoded: Uint8Array): TransactionRequest {
        // Check if this is a dynamic fee transaction (EIP-1559) by looking for 0x51 prefix
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
     * Decodes the given RLPValidObject into a {@link Body} object.
     *
     * @param {RLPValidObject} decoded - The object containing the encoded transaction data to decode.
     * @return {Body} The decoded Body object containing all transaction details.
     */
    private static decodeBody(decoded: RLPValidObject): Body {
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
                    : 0n,
            gasPayerSignature: decoded.gasPayerSignature as Uint8Array,
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
            nonce: decoded.nonce as number,
            originSignature: Uint8Array.of(),
            reserved: decoded.reserved as Uint8Array[],
            signature: decoded.signature as Uint8Array
        } satisfies Body;
    }

    /**
     * Decodes a dynamic fee transaction request from its encoded representation.
     *
     * The [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) dynamic fee
     * transaction request uses `maxFeePerGas` and `maxPriorityFeePerGas`
     * properties.
     *
     * @param {Uint8Array} encoded - The encoded dynamic fee transaction request.
     * @return {TransactionRequest} The decoded transaction request object.
     * @throws {InvalidEncodingError} If the encoded data does not match the expected format.
     */
    private static decodeDynamicFee(encoded: Uint8Array): TransactionRequest {
        const rlpProfile = TransactionRequestRLPCodec.getRLPProfile(
            encoded,
            TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_SIGNED_REQUEST,
            TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_UNSIGNED_REQUEST,
            `${FQP}TransactionRequestRLPCodec.decode(encoded: Uint8Array): TransactionRequest`
        );

        const decoded = RLPProfiler.ofObjectEncoded(encoded, rlpProfile)
            .object as RLPValidObject;
        const body = TransactionRequestRLPCodec.decodeBody(decoded);

        return TransactionRequestRLPCodec.finalizeDecodedObject(
            decoded,
            body,
            TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH,
            true
        );
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
            TransactionRequestRLPCodec.RLP_LEGACY_SIGNED_REQUEST,
            TransactionRequestRLPCodec.RLP_LEGACY_UNSIGNED_REQUEST,
            `${FQP}TransactionRequestRLPCodec.decode(encoded: Uint8Array): TransactionRequest`
        );

        const decoded = RLPProfiler.ofObjectEncoded(encoded, rlpProfile)
            .object as RLPValidObject;
        const body = TransactionRequestRLPCodec.decodeBody(decoded);

        return TransactionRequestRLPCodec.finalizeDecodedObject(
            decoded,
            body,
            TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH,
            false
        );
    }

    /**
     * Encodes a given transaction request into a RLP serialized format.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to be encoded.
     * @param {boolean} [isToHash=false] - Specifies whether the encoded output should be prepared for hashing.
     *        If true, the ecoding ignore the `signature` field and only encodes the `clauses` and `reserved` fields.
     *        If false, the encoding includes the `signature` field.
     * @return {Uint8Array} The serialized and encoded transaction request.
     */
    public static encode(
        transactionRequest: TransactionRequest,
        isToHash: boolean = false
    ): Uint8Array {
        const body = {
            ...TransactionRequestRLPCodec.mapTransactionRequestToBody(
                transactionRequest
            )
        };
        if (transactionRequest.isDynamicFee) {
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([
                TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX,
                ...RLPProfiler.ofObject(body, {
                    name: 'tx',
                    kind: isToHash
                        ? TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH
                        : transactionRequest.isSigned
                          ? TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_SIGNED_REQUEST
                          : TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_UNSIGNED_REQUEST
                }).encoded
            ]);
        }
        return RLPProfiler.ofObject(body, {
            name: 'tx',
            kind: isToHash
                ? TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH
                : transactionRequest.isSigned
                  ? TransactionRequestRLPCodec.RLP_LEGACY_SIGNED_REQUEST
                  : TransactionRequestRLPCodec.RLP_LEGACY_UNSIGNED_REQUEST
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
     * Finalizes a decoded object into a TransactionRequest by processing the required fields,
     * including the signature components and optionally calculating the beggar address
     * if it is not explicitly provided in the decoded data.
     *
     * @param {RLPValidObject} decoded - The decoded RLP object containing the transaction details and signatures.
     * @param {Body} body - The transaction body with the essential fields to be mapped into the TransactionRequest.
     * @param {RLPProfile[]} toHashProfile - The RLP profiling rules for determining how the transaction should be encoded for hashing.
     * @param {boolean} isDynamicFee - A flag indicating whether dynamic fee rules should be applied when computing the hash.
     *
     * @return {TransactionRequest} The finalized transaction request, containing the mapped body, signatures, and optionally derived beggar address.
     */
    private static finalizeDecodedObject(
        decoded: RLPValidObject,
        body: Body,
        toHashProfile: RLPProfile[],
        isDynamicFee: boolean
    ): TransactionRequest {
        const signature = decoded.signature as Uint8Array;
        const gasPayerSignature =
            signature !== null && signature !== undefined
                ? signature.slice(Secp256k1.SIGNATURE_LENGTH, signature.length)
                : (decoded.gasPayerSignature as Uint8Array);
        const originSignature =
            signature !== null && signature !== undefined
                ? signature.slice(0, Secp256k1.SIGNATURE_LENGTH)
                : (decoded.originSignature as Uint8Array);

        let beggar: Address | undefined;
        if (decoded.beggar !== null && decoded.beggar !== undefined) {
            beggar = Address.of(decoded.beggar as string);
        } else if (signature?.length === Secp256k1.SIGNATURE_LENGTH * 2) {
            const hashData = isDynamicFee
                ? new Uint8Array([
                      TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX,
                      ...RLPProfiler.ofObject(
                          { ...body },
                          { name: 'tx', kind: toHashProfile }
                      ).encoded
                  ])
                : RLPProfiler.ofObject(
                      { ...body },
                      { name: 'tx', kind: toHashProfile }
                  ).encoded;

            const originHash = Blake2b256.of(hashData).bytes;
            beggar = Address.ofPublicKey(
                Secp256k1.recover(originHash, originSignature)
            );
        }
        return new TransactionRequest(
            {
                ...TransactionRequestRLPCodec.mapBodyToTransactionRequest(body),
                beggar
            },
            originSignature,
            gasPayerSignature,
            signature
        );
    }

    /**
     * Maps the provided body object into a TransactionRequest object.
     *
     * @param {Body} body - The input body containing transaction details, including clauses, chain information, signatures, and related parameters.
     * @return {TransactionRequest} A TransactionRequest object created from the input body, containing transaction details and signatures.
     */
    private static mapBodyToTransactionRequest(body: Body): TransactionRequest {
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
            beggar:
                body.beggar !== undefined ? Address.of(body.beggar) : undefined,
            blockRef: Hex.of(body.blockRef),
            chainTag: body.chainTag,
            clauses,
            dependsOn: body.dependsOn !== null ? Hex.of(body.dependsOn) : null,
            expiration: body.expiration,
            gas: body.gas,
            gasPriceCoef: body.gasPriceCoef,
            nonce: body.nonce,
            maxFeePerGas: body.maxFeePerGas,
            maxPriorityFeePerGas: body.maxPriorityFeePerGas
        };
        // Create and return TransactionRequest with signatures.
        return new TransactionRequest(
            params,
            body.originSignature,
            body.gasPayerSignature,
            body.signature
        );
    }

    /**
     * Maps a TransactionRequest object to a {@link Body} object for transaction creation.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request containing all necessary properties such as clauses, gas, signature, and more.
     * @return {Body} A Body object that represents the structured transaction data ready for use, with properties like clauses, gas, signatures, and appropriate fee configurations based on transaction type.
     */
    private static mapTransactionRequestToBody(
        transactionRequest: TransactionRequest
    ): Body {
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
            beggar: transactionRequest.beggar?.toString(),
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses,
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            gasPayerSignature: transactionRequest.gasPayerSignature,
            nonce: transactionRequest.nonce,
            originSignature: transactionRequest.originSignature,
            reserved: transactionRequest.isIntendedToBeSponsored
                ? [Uint8Array.of(1)]
                : [],
            signature: transactionRequest.signature
        };

        // For dynamic fee transactions, use maxFeePerGas and maxPriorityFeePerGas
        if (transactionRequest.isDynamicFee) {
            return {
                ...baseBody,
                maxFeePerGas: transactionRequest.maxFeePerGas ?? 0n,
                maxPriorityFeePerGas:
                    transactionRequest.maxPriorityFeePerGas ?? 0n
            } satisfies Body;
        }

        // For legacy transactions (type 0), use gasPriceCoef
        return {
            ...baseBody,
            gasPriceCoef: transactionRequest.gasPriceCoef
        } satisfies Body;
    }
}

/**
 * Interface representing the body of a transaction request.
 * Used for RLP encoding/decoding only, hence using only
 * JS primitive type.
 *
 * @remarks Not intended to be exported.
 */
interface Body {
    beggar?: string;
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
    gasPayerSignature: Uint8Array;
    gasPriceCoef?: bigint; // Optional for dynamic fee transactions
    nonce: number;
    maxFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    maxPriorityFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    originSignature: Uint8Array;
    reserved: Uint8Array[]; // For VIP-191 transactions, having one element = 1 to flag the transaction as intended to be sponsored.
    signature: Uint8Array;
}

export { TransactionRequestRLPCodec };
