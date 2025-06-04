import {
    Address,
    BlockRef,
    HexUInt,
    IllegalArgumentError,
    Quantity,
    TxId,
    UInt
} from '@vechain/sdk-core';
import { Clause } from '@thor/model/Clause';
import { XOutput } from '@thor/model/XOutput';
import { type ReceiptJSON } from '@thor/model/ReceiptJSON';
import { type ClauseJSON } from './ClauseJSON';
import { type XOutputJSON } from '@thor/model/XOutputJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/XReceipt.ts!'; // todo: check once moved

/**
 * [Receipt](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */

class Receipt {
    /**
     * The transaction identifier.
     */
    readonly id: TxId;

    /**
     * The transaction type of this receipt
     */
    readonly type?: UInt;

    /**
     * The chain tag identifier of this blockchain.
     */
    readonly chainTag: UInt;

    /**
     * The address of the origin account.
     */
    readonly origin: Address;

    /**
     * The address of the sponsor / delegator account.
     */
    readonly delegator?: Address;

    /**
     * Byte size of the transaction that is RLP encoded.
     */
    readonly size: UInt; // int

    /**
     * The first 8 bytes of a referenced block ID.
     */
    readonly blockRef: BlockRef;

    /**
     * The expiration of the transaction, represented as the number of blocks after the `blockRef`.
     */
    readonly expiration: UInt;

    /**
     * An array of clauses that are executed by the transaction.
     */
    readonly clauses: Clause[];

    /**
     * The coefficient used to calculate the final gas price of the transaction.
     */
    readonly gasPriceCoef?: UInt;

    /**
     * The maximum amount that can be spent to pay for base fee and priority fee expressed in hex.
     */
    readonly maxFeePerGas?: UInt;

    /**
     * The maximum amount that can be tipped to the validator expressed in hex.
     */
    readonly maxPriorityFeePerGas?: UInt;

    /**
     * The max amount of gas that can be used by the transaction.
     */
    readonly gas: UInt;

    /**
     *  The transaction ID that this transaction depends on.
     */
    readonly dependsOn?: TxId;

    /**
     * The transaction nonce is a 64-bit unsigned integer determined by the transaction sender.
     */
    readonly nonce: UInt;

    /**
     * The amount of gas used by the transaction.
     */
    readonly gasUsed: UInt;

    /**
     * The address of the account that paid the gas fee.
     */
    readonly gasPayer: Address;

    /**
     * The amount of energy (VTHO) in wei, used to pay for the gas.
     * It can be outside the range of safe numbers, hence represented as bigint.
     */
    readonly paid: bigint;

    /**
     * The amount of energy (VTHO) in wei, paid to the block signer as a reward.
     * It can be outside the range of safe numbers, hence represented as bigint.
     */
    readonly reward: bigint;

    /**
     * Indicates whether the transaction was reverted (true means reverted).
     */
    readonly reverted: boolean;

    /**
     * An array of outputs produced by the transaction.
     */
    readonly outputs: XOutput[];

    /**
     * Constructs an instance of the class using the provided TransferJSON object.
     *
     * @param {ReceiptJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: ReceiptJSON) {
        try {
            this.id = TxId.of(json.id);
            this.type =
                json.type !== undefined && json.type !== null
                    ? UInt.of(json.type)
                    : undefined;
            this.origin = Address.of(json.origin);
            this.delegator =
                json.delegator !== undefined && json.delegator !== null
                    ? Address.of(json.delegator)
                    : undefined;
            this.size = UInt.of(json.size);
            this.chainTag = UInt.of(json.chainTag);
            this.blockRef = BlockRef.of(json.blockRef);
            this.expiration = UInt.of(json.expiration);
            this.clauses = json.clauses.map(
                (clause: ClauseJSON): Clause => new Clause(clause)
            );
            this.gasPriceCoef =
                json.gasPriceCoef !== undefined && json.gasPriceCoef !== null
                    ? UInt.of(json.gasPriceCoef)
                    : undefined;
            this.maxFeePerGas =
                json.maxFeePerGas !== undefined && json.maxFeePerGas !== null
                    ? UInt.of(HexUInt.of(json.maxFeePerGas).n)
                    : undefined;
            this.maxPriorityFeePerGas =
                json.maxPriorityFeePerGas !== undefined &&
                json.maxPriorityFeePerGas !== null
                    ? UInt.of(HexUInt.of(json.maxPriorityFeePerGas).n)
                    : undefined;
            this.gas = UInt.of(json.gas);
            this.dependsOn =
                json.dependsOn !== undefined && json.dependsOn !== null
                    ? TxId.of(json.dependsOn)
                    : undefined;
            this.nonce = UInt.of(Number(json.nonce));
            this.gasUsed = UInt.of(json.gasUsed);
            this.gasPayer = Address.of(json.gasPayer);
            this.paid = HexUInt.of(json.paid).bi;
            this.reward = HexUInt.of(json.reward).bi;
            this.reverted = json.reverted;
            this.outputs = json.outputs.map(
                (output: XOutputJSON): XOutput => new XOutput(output)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ReceiptJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a ReceiptJSON representation.
     *
     * @return {ReceiptJSON} The JSON object representing the current instance.
     */
    toJSON(): ReceiptJSON {
        const json = {
            id: this.id.toString(),
            type: this.type !== undefined ? this.type.valueOf() : null,
            origin: this.origin.toString(),
            delegator:
                this.delegator !== undefined ? this.delegator.toString() : null,
            size: this.size.valueOf(),
            chainTag: this.chainTag.valueOf(),
            blockRef: this.blockRef.toString(),
            expiration: this.expiration.valueOf(),
            clauses: this.clauses.map(
                (clause: Clause): ClauseJSON => clause.toJSON()
            ),
            gasPriceCoef:
                this.gasPriceCoef !== undefined
                    ? this.gasPriceCoef.valueOf()
                    : null,
            gas: this.gas.valueOf(),
            dependsOn:
                this.dependsOn !== undefined ? this.dependsOn.toString() : null,
            nonce: this.nonce.toString(),
            gasUsed: this.gasUsed.valueOf(),
            gasPayer: this.gasPayer.toString(),

            paid: Quantity.of(this.paid).toString(), // trim not significant zeros

            reward: Quantity.of(this.reward).toString(), // trim not significant zeros
            reverted: this.reverted,
            outputs: this.outputs.map(
                (output: XOutput): XOutputJSON => output.toJSON()
            )
        };
        if (this.maxFeePerGas !== undefined) {
            HexUInt.of(this.maxFeePerGas.valueOf()).toString();
        }
        return json satisfies ReceiptJSON;
    }
}

export { Receipt };
