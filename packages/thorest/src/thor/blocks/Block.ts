import {
    Address,
    BlockId,
    HexUInt,
    IllegalArgumentError,
    TxId,
    UInt
} from '@vechain/sdk-core';
import { type BlockJSON } from './BlockJSON';

/**
 * Full Qualified Path.
 */
const FQP = 'packages/thorest/src/thor/blocks/Block.ts!';

/**
 * [Block](http://localhost:8669/doc/stoplight-ui/#/schemas/Block)
 */
class Block {
    /**
     * The block number (height).
     */
    readonly number: UInt;

    /**
     * The block identifier.
     */
    readonly id: BlockId;

    /**
     * The RLP encoded block size in bytes.
     */
    readonly size: UInt;

    /**
     * The parent block identifier.
     */
    readonly parentID: BlockId;

    /**
     * The UNIX timestamp of the block.
     */
    readonly timestamp: UInt;

    /**
     * The maximum amount of gas that all transactions inside the block are allowed to consume.
     */
    readonly gasLimit: UInt;

    /**
     * The address assigned by the block proposer to receive the reward (in VTHO).
     */
    readonly beneficiary: Address;

    /**
     * The actual amount of gas used within the block.
     */
    readonly gasUsed: UInt;

    /**
     * The minimum amount of fee required to include a transaction in the current block.
     */
    readonly baseFeePerGas: HexUInt;

    /**
     * The accumulated witness number of the chain branch headed by the block.
     */
    readonly totalScore: UInt;

    /**
     * The root hash of transactions in the block.
     */
    readonly txsRoot: TxId; // check

    /**
     * The supported transaction features bitset.
     */
    readonly txsFeatures: UInt;

    /**
     * The root hash for the global state after applying changes in this block.
     */
    readonly stateRoot: TxId; // check

    /**
     * The hash of the transaction receipts trie.
     */
    readonly receiptsRoot: TxId; // check

    /**
     * Whether the block signer voted COM(Commit) in BFT.
     */
    readonly com: boolean;

    /**
     * The address of the block signer.
     */
    readonly signer: Address; // hex address

    /**
     * Constructs a new instance of the class by parsing the provided BlockJSON object.
     *
     * @param {BlockJSON} json - The JSON object containing block data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: BlockJSON) {
        try {
            this.number = UInt.of(json.number);
            this.id = BlockId.of(json.id);
            this.size = UInt.of(json.size);
            this.parentID = BlockId.of(json.parentID);
            this.timestamp = UInt.of(json.timestamp);
            this.gasLimit = UInt.of(json.gasLimit);
            this.beneficiary = Address.of(json.beneficiary);
            this.gasUsed = UInt.of(json.gasUsed);
            this.baseFeePerGas = HexUInt.of(json.baseFeePerGas);
            this.totalScore = UInt.of(json.totalScore);
            this.txsRoot = TxId.of(json.txsRoot);
            this.txsFeatures = UInt.of(json.txsFeatures);
            this.stateRoot = TxId.of(json.stateRoot);
            this.receiptsRoot = TxId.of(json.receiptsRoot);
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
     * @return {BlockJSON} A JSON object containing the block's data, including its number, id, size, parentID, timestamp, gasLimit, beneficiary, gasUsed, baseFeePerGas, totalScore, txsRoot, txsFeatures, stateRoot, receiptsRoot, com, and signer values.
     */
    toJSON(): BlockJSON {
        return {
            number: this.number.valueOf(),
            id: this.id.toString(),
            size: this.size.valueOf(),
            parentID: this.parentID.toString(),
            timestamp: this.timestamp.valueOf(),
            gasLimit: this.gasLimit.valueOf(),
            beneficiary: this.beneficiary.toString(),
            gasUsed: this.gasUsed.valueOf(),
            baseFeePerGas: this.baseFeePerGas.toString(),
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
