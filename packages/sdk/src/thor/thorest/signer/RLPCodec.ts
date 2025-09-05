import * as nc_utils from '@noble/curves/abstract/utils';
import {
    Clause,
    SignedTransactionRequest,
    SponsoredTransactionRequest,
    TransactionRequest
} from '@thor/thorest/model';
import {
    Address,
    Blake2b256,
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    HexUInt,
    NumericKind,
    OptionalFixedHexBlobKind,
    Quantity,
    RLP,
    type RLPProfile,
    RLPProfiler,
    type RLPValidObject,
    Secp256k1
} from '@common'; // eslint-disable-next-line @typescript-eslint/no-extraneous-class

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class RLPCodec {
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
    private static readonly RLP_SIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodec.RLP_FIELDS.concat([RLPCodec.RLP_SIGNATURE])
    };

    /**
     * Represents a Recursive Length Prefix (RLP) of the unsigned transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */
    private static readonly RLP_UNSIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodec.RLP_FIELDS
    };

    /**
     * Decodes an encoded transaction and returns an instance of a TransactionRequest,
     * SignedTransactionRequest, or SponsoredTransactionRequest based on the encoded data.
     *
     * @param {Uint8Array} encoded - The encoded transaction data to decode.
     * @return {TransactionRequest | SignedTransactionRequest | SponsoredTransactionRequest}
     *         Returns a TransactionRequest if the transaction is unsigned.
     *         Returns a SignedTransactionRequest if the transaction is signed.
     *         Returns a SponsoredTransactionRequest if the transaction is signed and includes a gas payer.
     * @throws {IllegalArgumentError} Throws an error if the encoded data is invalid.
     */
    public static decode(
        encoded: Uint8Array
    ):
        | TransactionRequest
        | SignedTransactionRequest
        | SponsoredTransactionRequest {
        const isSigned =
            (RLP.ofEncoded(encoded).decoded as unknown[]).length >
            (RLPCodec.RLP_UNSIGNED_TRANSACTION_PROFILE.kind as []).length;
        const decoded = RLPProfiler.ofObjectEncoded(
            encoded,
            isSigned
                ? RLPCodec.RLP_SIGNED_TRANSACTION_PROFILE
                : RLPCodec.RLP_UNSIGNED_TRANSACTION_PROFILE
        ).object as RLPValidObject;
        const clauses = (decoded.clauses as []).map(
            (decodedClause: RLPValidObject) => {
                return Clause.of({
                    to: (decodedClause.to as string) ?? null,
                    value:
                        typeof decodedClause.value === 'number'
                            ? Quantity.of(decodedClause.value).toString()
                            : typeof decodedClause.value === 'string'
                              ? Quantity.of(
                                    HexUInt.of(decodedClause.value).bi
                                ).toString()
                              : Quantity.PREFIX,
                    data: (decodedClause.data as string) ?? undefined
                });
            }
        );
        const isIntendedToBeSponsored = (decoded.reserved as []).length > 0;
        const transactionRequest = new TransactionRequest({
            blockRef: HexUInt.of(decoded.blockRef as string),
            chainTag: decoded.chainTag as number,
            clauses,
            dependsOn:
                decoded.dependsOn === null
                    ? null
                    : Hex.of(decoded.dependsOn as string),
            expiration: decoded.expiration as number,
            gas: BigInt(decoded.gas as bigint), // Double cast needed else a number is returned.
            gasPriceCoef: BigInt(decoded.gasPriceCoef as bigint), // Double cast needed else a number is returned.
            nonce: decoded.nonce as number,
            isIntendedToBeSponsored
        });
        if (isSigned) {
            const signature = decoded.signature as Uint8Array;
            const encodedTransactionRequest =
                RLPCodec.encodeTransactionRequest(transactionRequest);
            const originSignature = signature.slice(
                0,
                Secp256k1.SIGNATURE_LENGTH
            );
            const originHash = Blake2b256.of(encodedTransactionRequest).bytes;
            const origin = Address.ofPublicKey(
                Secp256k1.recover(originHash, originSignature)
            );
            const signedTransactionRequest = new SignedTransactionRequest({
                ...transactionRequest,
                origin,
                originSignature,
                signature
            });
            if (signature.length > Secp256k1.SIGNATURE_LENGTH) {
                const gasPayerSignature = signature.slice(
                    Secp256k1.SIGNATURE_LENGTH,
                    Secp256k1.SIGNATURE_LENGTH * 2
                );
                const gasPayerHash = Blake2b256.of(
                    nc_utils.concatBytes(originHash, origin.bytes)
                ).bytes;
                const gasPayer = Address.ofPublicKey(
                    Secp256k1.recover(gasPayerHash, gasPayerSignature)
                );
                return new SponsoredTransactionRequest({
                    ...signedTransactionRequest,
                    gasPayer,
                    gasPayerSignature
                });
            }
            return signedTransactionRequest;
        }
        return transactionRequest;
    }

    /**
     * Encodes a given transaction request into a Uint8Array.
     *
     * @param {TransactionRequest | SignedTransactionRequest} transactionRequest - The transaction request to encode, which can be either a TransactionRequest or a SignedTransactionRequest.
     * @return {Uint8Array} The encoded transaction request as a Uint8Array.
     */
    public static encode(
        transactionRequest: TransactionRequest | SignedTransactionRequest
    ): Uint8Array {
        if (transactionRequest instanceof SignedTransactionRequest) {
            return RLPCodec.encodeSignedTransactionRequest(transactionRequest);
        }
        return RLPCodec.encodeTransactionRequest(transactionRequest);
    }

    /**
     * Encodes a signed transaction request into a Uint8Array format.
     *
     * @param {SignedTransactionRequest} transactionRequest - The signed transaction request object containing transaction details.
     * @return {Uint8Array} The encoded transaction request as a Uint8Array.
     */
    private static encodeSignedTransactionRequest(
        transactionRequest: SignedTransactionRequest
    ): Uint8Array {
        return RLPCodec.encodeSignedBodyField(
            {
                ...RLPCodec.mapBody(transactionRequest),
                reserved: transactionRequest.isIntendedToBeSponsored
                    ? [Uint8Array.of(1)]
                    : [] // encodeReservedField(tx)
            },
            transactionRequest.signature
        );
    }

    /**
     * Encodes a transaction request object into a Uint8Array using RLP encoding.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request object to encode.
     * @return {Uint8Array} The encoded transaction request as a byte array.
     */
    private static encodeTransactionRequest(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        return RLPCodec.encodeUnsignedBodyField({
            ...RLPCodec.mapBody(transactionRequest),
            reserved: transactionRequest.isIntendedToBeSponsored
                ? [Uint8Array.of(1)]
                : [] // encodeReservedField(tx)
        });
    }

    /**
     * Encodes the given object with a signature into a single Uint8Array using RLP encoding.
     *
     * @param {RLPValidObject} body - The main object to be encoded. This should be a valid RLP object.
     * @param {Uint8Array} signature - The signature to be included in the encoded result.
     * @return {Uint8Array} The encoded Uint8Array representation of the object and signature.
     */
    private static encodeSignedBodyField(
        body: RLPValidObject,
        signature: Uint8Array
    ): Uint8Array {
        return RLPProfiler.ofObject(
            {
                ...body,
                signature
            },
            RLPCodec.RLP_SIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    /**
     * Encodes an unsigned body field into a Uint8Array using RLP (Recursive Length Prefix) encoding.
     *
     * @param {RLPValidObject} body - The object representing the body field to be encoded.
     * @return {Uint8Array} The encoded unsigned body field as a Uint8Array.
     */
    private static encodeUnsignedBodyField(body: RLPValidObject): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodec.RLP_UNSIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    /**
     * Transforms a `TransactionRequest` object into a `TransactionRequestJSON` object.
     *
     * @param transactionRequest The `TransactionRequest` object to be transformed.
     * @return The transformed `TransactionRequestJSON` object.
     */
    private static mapBody(
        transactionRequest: TransactionRequest
    ): TransactionRequestJSON {
        return {
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: RLPCodec.mapClauses(transactionRequest),
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            gasPriceCoef: transactionRequest.gasPriceCoef,
            nonce: transactionRequest.nonce
        } satisfies TransactionRequestJSON;
    }

    /**
     * Transforms the clauses in a transaction request into an array of mapped objects.
     *
     * @param {TransactionRequest} transactionRequest - The transaction request containing clauses to be mapped.
     * @return {Array<{to: string | null, value: bigint, data: string}>} An array of mapped clause objects containing properties: `to`, `value`, and `data`.
     */
    private static mapClauses(transactionRequest: TransactionRequest): Array<{
        to: string | null;
        value: bigint;
        data: string;
    }> {
        return transactionRequest.clauses.map(
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
    }
}

/**
 * Represents the structure of a transaction request in JSON format
 * to be encoded according RLP rules.
 *
 * @remark This interface is only used internally in {@link RLPCodec} methods.
 * Not to be exported.
 */
interface TransactionRequestJSON {
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
    gasPriceCoef: bigint;
    nonce: number;
    reserved?: {
        features?: number;
        unused?: Uint8Array[];
    };
}

export { RLPCodec };
