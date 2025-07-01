import {
    Address,
    type Hex,
    HexInt,
    HexUInt,
    HexUInt32,
    IllegalArgumentError,
    UInt
} from '@vechain/sdk-core';
import { Clause, type ClauseJSON } from '@thor';
import { type TxJSON } from '@thor/model/TxJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/transactions/Tx.ts!';

/**
 * [Tx](http://localhost:8669/doc/stoplight-ui/#/schemas/Tx)
 */
class Tx {
    /**
     * The transaction identifier.
     *
     * Match pattern: ^0x[0-9a-f]{64}$
     */
    readonly id: Hex;

    /**
     * id
     */
    readonly type: number | null; // int

    /**
     * The address of the origin account.
     *
     * Match pattern: ^0x[0-9a-f]{40}$
     */
    readonly origin: Address;

    /**
     * The address of the sponsor / delegator account.
     *
     * Match pattern: ^0x[0-9a-f]{40}$
     */
    readonly delegator: Address | null;

    /**
     * Byte size of the transaction that is RLP encoded.
     */
    readonly size: number;

    /**
     * The last byte of the genesis block ID.
     */
    readonly chainTag: number;

    /**
     * The first 8 bytes of a referenced block ID.
     *
     * Match pattern: ^0x[0-9a-f]{64}$
     */
    readonly blockRef: Hex;

    /**
     * The expiration of the transaction, represented as the number of blocks after the `blockRef`.
     */
    readonly expiration: number;

    /**
     * An array of clauses that are executed by the transaction.
     */
    readonly clauses: Clause[];

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     */
    readonly gasPriceCoef: bigint | null;

    /**
     * The maximum amount that can be spent to pay for base fee and priority fee expressed in hex.
     */
    readonly maxFeePerGas: bigint | null;

    /**
     * The maximum amount that can be tipped to the validator expressed in hex.
     */
    readonly maxPriorityFeePerGas: bigint | null;

    /**
     * The max amount of gas that can be used by the transaction.
     */
    readonly gas: bigint;

    /**
     * The transaction ID that this transaction depends on.
     */
    readonly dependsOn: Hex | null; // hex ^0x[0-9a-f]{64}$

    /**
     * The transaction nonce is a 64-bit unsigned integer that is determined by the transaction sender.
     */
    readonly nonce: bigint; // hex int

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {TxJSON} json - The JSON object containing raw transaction data and metadata.
     * @throws {IllegalArgumentError} If the input JSON cannot be parsed correctly.
     */
    constructor(json: TxJSON) {
        try {
            this.id = HexUInt32.of(json.id);
            this.type =
                json.type === null ? null : UInt.of(json.type).valueOf();
            this.origin = Address.of(json.origin);
            this.delegator =
                json.delegator !== null ? Address.of(json.delegator) : null;
            this.size = UInt.of(json.size).valueOf();
            this.chainTag = UInt.of(json.chainTag).valueOf();
            this.blockRef = HexUInt.of(json.blockRef);
            this.expiration = UInt.of(json.expiration).valueOf();
            this.clauses = json.clauses.map(
                (clause: ClauseJSON): Clause => new Clause(clause)
            );
            this.gasPriceCoef =
                json.gasPriceCoef !== null && json.gasPriceCoef !== undefined
                    ? BigInt(json.gasPriceCoef)
                    : null;
            this.maxFeePerGas =
                json.maxFeePerGas !== null && json.maxFeePerGas !== undefined
                    ? HexInt.of(json.maxFeePerGas).bi
                    : null;
            this.maxPriorityFeePerGas =
                json.maxPriorityFeePerGas !== null &&
                json.maxPriorityFeePerGas !== undefined
                    ? HexInt.of(json.maxPriorityFeePerGas).bi
                    : null;
            this.gas = BigInt(json.gas);
            this.dependsOn =
                json.dependsOn !== null ? HexUInt32.of(json.dependsOn) : null;
            this.nonce = HexUInt.of(json.nonce).bi;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TxJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current transaction object to its JSON representation.
     *
     * @return {GetTxResponseJSON} The JSON representation of the transaction object.
     */
    toJSON(): TxJSON {
        return {
            id: this.id.toString(),
            type: this.type,
            origin: this.origin.toString(),
            delegator:
                this.delegator !== null ? this.delegator.toString() : null,
            size: this.size,
            chainTag: this.chainTag,
            blockRef: this.blockRef.toString(),
            expiration: this.expiration,
            clauses: this.clauses.map(
                (clause: Clause): ClauseJSON => clause.toJSON()
            ),
            gasPriceCoef:
                this.gasPriceCoef !== null
                    ? this.gasPriceCoef.toString()
                    : null,
            maxFeePerGas:
                this.maxFeePerGas !== null
                    ? HexInt.of(this.maxFeePerGas).toString()
                    : null,
            maxPriorityFeePerGas:
                this.maxPriorityFeePerGas !== null
                    ? this.maxPriorityFeePerGas.toString()
                    : null,
            gas: this.gas.toString(),
            dependsOn:
                this.dependsOn !== null ? this.dependsOn.toString() : null,
            nonce: HexUInt.of(this.nonce).toString()
        } satisfies TxJSON;
    }
}

export { Tx };
