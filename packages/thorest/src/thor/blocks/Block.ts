import {
    Address,
    HexUInt,
    HexUInt32,
    IllegalArgumentError,
    UInt,
    type Hex
} from '@vechain/sdk-core';
import { type BlockJSON } from '@thor/blocks/BlockJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/Block.ts!';

/**
 * [Block](http://localhost:8669/doc/stoplight-ui/#/schemas/Block)
 */
class Block {
    /**
     * The block number (height).
     */
    readonly number: number;

    /**
     * The block identifier.
     */
    readonly id: Hex;

    /**
     * The RLP encoded block size in bytes.
     */
    readonly size: number;

    /**
     * The parent block identifier.
     */
    readonly parentID: Hex;

    /**
     * The UNIX timestamp of the block.
     */
    readonly timestamp: number;

    /**
     * The maximum amount of gas that all transactions inside the block are allowed to consume.
     */
    readonly gasLimit: bigint;

    /**
     * The address assigned by the block proposer to receive the reward (in VTHO).
     */
    readonly beneficiary: Address;

    /**
     * The actual amount of gas used within the block.
     */
    readonly gasUsed: bigint;

    /**
     * The minimum amount of fee required to include a transaction in the current block.
     */
    readonly baseFeePerGas?: bigint;

    /**
     * The accumulated witness number of the chain branch headed by the block.
     */
    readonly totalScore: number;

    /**
     * The root hash of transactions in the block.
     */
    readonly txsRoot: Hex; // check

    /**
     * The supported transaction features bitset.
     */
    readonly txsFeatures: number;

    /**
     * The root hash for the global state after applying changes in this block.
     */
    readonly stateRoot: Hex; // check

    /**
     * The hash of the transaction receipts trie.
     */
    readonly receiptsRoot: Hex; // check

    /**
     * Whether the block signer voted COM(Commit) in BFT.
     */
    readonly com: boolean;

    /**
     * The address of the block signer.
     */
    readonly signer: Address; // hex address

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {BlockJSON} json - The JSON object containing block data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: BlockJSON) {
        try {
            this.number = UInt.of(json.number).valueOf();
            this.id = HexUInt32.of(json.id);
            this.size = UInt.of(json.size).valueOf();
            this.parentID = HexUInt.of(json.parentID);
            this.timestamp = UInt.of(json.timestamp).valueOf();
            this.gasLimit = BigInt(json.gasLimit);
            this.beneficiary = Address.of(json.beneficiary);
            this.gasUsed = BigInt(json.gasUsed);
            this.baseFeePerGas =
                json.baseFeePerGas !== undefined
                    ? HexUInt.of(json.baseFeePerGas).bi
                    : undefined;
            this.totalScore = UInt.of(json.totalScore).valueOf();
            this.txsRoot = HexUInt32.of(json.txsRoot);
            this.txsFeatures = UInt.of(json.txsFeatures).valueOf();
            this.stateRoot = HexUInt32.of(json.stateRoot);
            this.receiptsRoot = HexUInt32.of(json.receiptsRoot);
            this.com = json.com;
            this.signer = Address.of(json.signer);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: BlockJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current block data into a JSON representation conforming to the BlockJSON structure.
     *
     * @returns {BlockJSON} A JSON object containing the block's data, including its number, id, size, parentID, timestamp, gasLimit, beneficiary, gasUsed, baseFeePerGas, totalScore, txsRoot, txsFeatures, stateRoot, receiptsRoot, com, and signer values.
     */
    toJSON(): BlockJSON {
        return {
            number: this.number.valueOf(),

            id: this.id.toString(),
            size: this.size.valueOf(),

            parentID: this.parentID.toString(),
            timestamp: this.timestamp.valueOf(),
            gasLimit: this.gasLimit.toString(),
            beneficiary: this.beneficiary.toString(),
            gasUsed: this.gasUsed.toString(),
            baseFeePerGas: this.baseFeePerGas?.toString(),
            totalScore: this.totalScore.valueOf(),

            txsRoot: this.txsRoot.toString(),
            txsFeatures: this.txsFeatures.valueOf(),

            stateRoot: this.stateRoot.toString(),

            receiptsRoot: this.receiptsRoot.toString(),
            com: this.com,
            signer: this.signer.toString()
        } satisfies BlockJSON;
    }
}

export { Block };
