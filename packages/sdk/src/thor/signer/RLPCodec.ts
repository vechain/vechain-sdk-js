import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
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
    type RLPValidObject
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

    // EIP-1559 dynamic fee transaction fields (type 2)
    private static readonly RLP_DYNAMIC_FEE_FIELDS = [
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

    private static readonly RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: RLPCodec.RLP_DYNAMIC_FEE_FIELDS
        };

    private static readonly RLP_UNSIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodec.RLP_FIELDS
    };

    public static decode(encoded: Uint8Array): TransactionRequest {
        // Check if this is a dynamic fee transaction (EIP-1559) by looking for 0x51 prefix
        const isDynamicFee = encoded.length > 0 && encoded[0] === 0x51;

        // Remove the transaction type prefix if present
        const rlpData = isDynamicFee ? encoded.slice(1) : encoded;

        // Select the appropriate RLP profile based on transaction type and signature status
        let profile: RLPProfile;
        if (isDynamicFee) {
            profile = RLPCodec.RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE;
        } else {
            profile = RLPCodec.RLP_UNSIGNED_TRANSACTION_PROFILE;
        }

        // Decode using the appropriate profile
        const decoded = RLPProfiler.ofObjectEncoded(rlpData, profile)
            .object as RLPValidObject;

        // Parse clauses
        const clauses = (decoded.clauses as []).map(
            (decodedClause: RLPValidObject) => {
                return new Clause(
                    (decodedClause.to as string) != null
                        ? Address.of(decodedClause.to as string)
                        : null,
                    BigInt(decodedClause.value as string),
                    Hex.of(decodedClause.data as string) ?? undefined
                );
            }
        );

        if (isDynamicFee) {
            // Dynamic fee transaction - use maxFeePerGas and maxPriorityFeePerGas
            return new TransactionRequest({
                blockRef: HexUInt.of(decoded.blockRef as string),
                chainTag: decoded.chainTag as number,
                clauses,
                dependsOn:
                    decoded.dependsOn === null
                        ? null
                        : Hex.of(decoded.dependsOn as string),
                expiration: decoded.expiration as number,
                gas: BigInt(decoded.gas as bigint),
                gasPriceCoef: 0n, // Dynamic fee transactions use 0 for gasPriceCoef
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
                nonce: decoded.nonce as number
            });
        } else {
            // Legacy transaction - use gasPriceCoef
            return new TransactionRequest({
                blockRef: HexUInt.of(decoded.blockRef as string),
                chainTag: decoded.chainTag as number,
                clauses,
                dependsOn:
                    decoded.dependsOn === null
                        ? null
                        : Hex.of(decoded.dependsOn as string),
                expiration: decoded.expiration as number,
                gas: BigInt(decoded.gas as bigint),
                gasPriceCoef: BigInt(decoded.gasPriceCoef as bigint),
                nonce: decoded.nonce as number
            });
        }
    }

    public static encode(transactionRequest: TransactionRequest): Uint8Array {
        const body = {
            ...RLPCodec.mapBody(transactionRequest),
            reserved: transactionRequest.isIntendedToBeSponsored
                ? [Uint8Array.of(1)]
                : [] // encodeReservedField(tx)
        };
        if (transactionRequest.isDynamicFee) {
            const encodedTx = RLPCodec.encodeUnsignedDynamicFeeBodyField(body);
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([0x51, ...encodedTx]);
        }
        return RLPCodec.encodeUnsignedBodyField(body);
    }

    private static encodeUnsignedBodyField(body: RLPValidObject): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodec.RLP_UNSIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    private static encodeUnsignedDynamicFeeBodyField(
        body: RLPValidObject
    ): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodec.RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE
        ).encoded;
    }

    private static mapBody(
        transactionRequest: TransactionRequest
    ): TransactionRequestJSON {
        const baseBody = {
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: RLPCodec.mapClauses(transactionRequest),
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            nonce: transactionRequest.nonce
        };

        // For dynamic fee transactions, use maxFeePerGas and maxPriorityFeePerGas
        if (transactionRequest.isDynamicFee) {
            return {
                ...baseBody,
                maxFeePerGas: transactionRequest.maxFeePerGas ?? 0n,
                maxPriorityFeePerGas:
                    transactionRequest.maxPriorityFeePerGas ?? 0n
            } satisfies TransactionRequestJSON;
        }

        // For legacy transactions (type 0), use gasPriceCoef
        return {
            ...baseBody,
            gasPriceCoef: transactionRequest.gasPriceCoef
        } satisfies TransactionRequestJSON;
    }

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
    gasPriceCoef?: bigint; // Optional for dynamic fee transactions
    nonce: number;
    maxFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    maxPriorityFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    reserved?: {
        features?: number;
        unused?: Uint8Array[];
    };
}

export { RLPCodec };
