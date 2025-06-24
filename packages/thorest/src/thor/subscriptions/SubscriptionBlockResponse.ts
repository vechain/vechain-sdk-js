import {
    Address,
    BlockId,
    IllegalArgumentError,
    ThorId,
    type TxId,
    UInt
} from '@vechain/sdk-core';
import { type SubscriptionBlockResponseJSON } from '@thor/subscriptions';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/thorest/src/thor/subscriptions/SubscriptionBlockResponse.ts!';

/**
 * [SubscriptionBlockResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionBlockResponse)
 *
 * Represents a block response from a subscription.
 *
 */
class SubscriptionBlockResponse {
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
     * The accumulated witness number of the chain branch headed by the block.
     */
    readonly totalScore: UInt;

    /**
     * The root hash of transactions in the block.
     */
    readonly txsRoot: ThorId;

    /**
     * The supported transaction features bitset.
     */
    readonly txsFeatures: UInt;

    /**
     * The root hash for the global state after applying changes in this block.
     */
    readonly stateRoot: ThorId;

    /**
     * The hash of the transaction receipts trie.
     */
    readonly receiptsRoot: ThorId;

    /**
     * Whether the block signer voted COM(Commit) in BFT.
     */
    readonly com: boolean;

    /**
     * The address of the block signer.
     */
    readonly signer: Address;

    /**
     * Whether the block is obsolete.
     */
    readonly obsolete: boolean;

    /**
     * The list of transaction identifiers in the block.
     */
    readonly transactions: TxId[];

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {SubscriptionBlockResponseJSON} json - The JSON object containing block response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: SubscriptionBlockResponseJSON) {
        try {
            this.number = UInt.of(json.number);
            this.id = BlockId.of(json.id);
            this.size = UInt.of(json.size);
            this.parentID = BlockId.of(json.parentID);
            this.timestamp = UInt.of(json.timestamp);
            this.gasLimit = BigInt(json.gasLimit);
            this.beneficiary = Address.of(json.beneficiary);
            this.gasUsed = BigInt(json.gasUsed);
            this.totalScore = UInt.of(json.totalScore);
            this.txsRoot = ThorId.of(json.txsRoot);
            this.txsFeatures = UInt.of(json.txsFeatures);
            this.stateRoot = ThorId.of(json.stateRoot);
            this.receiptsRoot = ThorId.of(json.receiptsRoot);
            this.com = json.com;
            this.signer = Address.of(json.signer);
            this.obsolete = json.obsolete;
            this.transactions = json.transactions.map(
                (txId: string): TxId => ThorId.of(txId)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: SubscriptionBlockResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current block response data into a JSON representation.
     *
     * @returns {SubscriptionBlockResponseJSON} A JSON object containing the block response data.
     */
    toJSON(): SubscriptionBlockResponseJSON {
        return {
            number: this.number.valueOf(),
            id: this.id.toString(),
            size: this.size.valueOf(),
            parentID: this.parentID.toString(),
            timestamp: this.timestamp.valueOf(),
            gasLimit: Number(this.gasLimit),
            beneficiary: this.beneficiary.toString(),
            gasUsed: Number(this.gasUsed),
            totalScore: this.totalScore.valueOf(),
            txsRoot: this.txsRoot.toString(),
            txsFeatures: this.txsFeatures.valueOf(),
            stateRoot: this.stateRoot.toString(),
            receiptsRoot: this.receiptsRoot.toString(),
            com: this.com,
            signer: this.signer.toString(),
            obsolete: this.obsolete,
            transactions: this.transactions.map((txId: ThorId) =>
                txId.toString()
            )
        } satisfies SubscriptionBlockResponseJSON;
    }
}

export { SubscriptionBlockResponse };
