import { Address, type Hex, HexUInt32, UInt } from '@common/vcdm';
import { type SubscriptionBlockResponseJSON } from '@thor/subscriptions';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/core/src/thor/subscriptions/SubscriptionBlockResponse.ts!';

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
     * The accumulated witness number of the chain branch headed by the block.
     */
    readonly totalScore: number;

    /**
     * The root hash of transactions in the block.
     */
    readonly txsRoot: Hex;

    /**
     * The supported transaction features bitset.
     */
    readonly txsFeatures: number;

    /**
     * The root hash for the global state after applying changes in this block.
     */
    readonly stateRoot: Hex;

    /**
     * The hash of the transaction receipts trie.
     */
    readonly receiptsRoot: Hex;

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
    readonly transactions: Hex[];

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {SubscriptionBlockResponseJSON} json - The JSON object containing block response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: SubscriptionBlockResponseJSON) {
        try {
            this.number = UInt.of(json.number).valueOf();
            this.id = HexUInt32.of(json.id);
            this.size = UInt.of(json.size).valueOf();
            this.parentID = HexUInt32.of(json.parentID);
            this.timestamp = UInt.of(json.timestamp).valueOf();
            this.gasLimit = BigInt(json.gasLimit);
            this.beneficiary = Address.of(json.beneficiary);
            this.gasUsed = BigInt(json.gasUsed);
            this.totalScore = UInt.of(json.totalScore).valueOf();
            this.txsRoot = HexUInt32.of(json.txsRoot);
            this.txsFeatures = UInt.of(json.txsFeatures).valueOf();
            this.stateRoot = HexUInt32.of(json.stateRoot);
            this.receiptsRoot = HexUInt32.of(json.receiptsRoot);
            this.com = json.com;
            this.signer = Address.of(json.signer);
            this.obsolete = json.obsolete;
            this.transactions = json.transactions.map(
                (txId: string): Hex => HexUInt32.of(txId)
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
            number: this.number,
            id: this.id.toString(),
            size: this.size,
            parentID: this.parentID.toString(),
            timestamp: this.timestamp,
            gasLimit: Number(this.gasLimit),
            beneficiary: this.beneficiary.toString(),
            gasUsed: Number(this.gasUsed),
            totalScore: this.totalScore,
            txsRoot: this.txsRoot.toString(),
            txsFeatures: this.txsFeatures,
            stateRoot: this.stateRoot.toString(),
            receiptsRoot: this.receiptsRoot.toString(),
            com: this.com,
            signer: this.signer.toString(),
            obsolete: this.obsolete,
            transactions: this.transactions.map((txId: Hex) => txId.toString())
        } satisfies SubscriptionBlockResponseJSON;
    }
}

export { SubscriptionBlockResponse };
