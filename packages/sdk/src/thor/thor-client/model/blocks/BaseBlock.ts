import type { Address, HexUInt, HexUInt32 } from '@common/vcdm';
import type {
    ExpandedBlockResponse,
    RegularBlockResponse
} from '@thor/thorest/blocks/response';

interface BaseBlockSnapshot {
    number: number;
    id: HexUInt32;
    size: number;
    parentID: HexUInt;
    timestamp: number;
    gasLimit: bigint;
    beneficiary: Address;
    gasUsed: bigint;
    baseFeePerGas?: bigint;
    totalScore: number;
    txsRoot: HexUInt32;
    txsFeatures: number;
    stateRoot: HexUInt32;
    receiptsRoot: HexUInt32;
    com: boolean;
    signer: Address;
    isTrunk: boolean;
    isFinalized: boolean;
}

/**
 * Helper union covering the common fields returned by the thorest regular/expanded block DTOs.
 * We keep it to avoid duplicating two near-identical mapping functions in the domain layer.
 */
type BlockResponseShape = RegularBlockResponse | ExpandedBlockResponse;

class BaseBlock {
    readonly number: number;

    readonly id: HexUInt32;

    readonly size: number;

    readonly parentID: HexUInt;

    readonly timestamp: number;

    readonly gasLimit: bigint;

    readonly beneficiary: Address;

    readonly gasUsed: bigint;

    readonly baseFeePerGas?: bigint;

    readonly totalScore: number;

    readonly txsRoot: HexUInt32;

    readonly txsFeatures: number;

    readonly stateRoot: HexUInt32;

    readonly receiptsRoot: HexUInt32;

    readonly com: boolean;

    readonly signer: Address;

    readonly isTrunk: boolean;

    readonly isFinalized: boolean;

    constructor(snapshot: BaseBlockSnapshot) {
        this.number = snapshot.number;
        this.id = snapshot.id;
        this.size = snapshot.size;
        this.parentID = snapshot.parentID;
        this.timestamp = snapshot.timestamp;
        this.gasLimit = snapshot.gasLimit;
        this.beneficiary = snapshot.beneficiary;
        this.gasUsed = snapshot.gasUsed;
        this.baseFeePerGas = snapshot.baseFeePerGas;
        this.totalScore = snapshot.totalScore;
        this.txsRoot = snapshot.txsRoot;
        this.txsFeatures = snapshot.txsFeatures;
        this.stateRoot = snapshot.stateRoot;
        this.receiptsRoot = snapshot.receiptsRoot;
        this.com = snapshot.com;
        this.signer = snapshot.signer;
        this.isTrunk = snapshot.isTrunk;
        this.isFinalized = snapshot.isFinalized;
    }

    /**
     * Normalizes a thorest block response (regular or expanded) into the internal snapshot format.
     */
    protected static snapshotFromResponse(
        response: BlockResponseShape
    ): BaseBlockSnapshot {
        return {
            number: response.number,
            id: response.id,
            size: response.size,
            parentID: response.parentID,
            timestamp: response.timestamp,
            gasLimit: response.gasLimit,
            beneficiary: response.beneficiary,
            gasUsed: response.gasUsed,
            baseFeePerGas: response.baseFeePerGas,
            totalScore: response.totalScore,
            txsRoot: response.txsRoot,
            txsFeatures: response.txsFeatures,
            stateRoot: response.stateRoot,
            receiptsRoot: response.receiptsRoot,
            com: response.com,
            signer: response.signer,
            isTrunk: response.isTrunk,
            isFinalized: response.isFinalized
        };
    }
}

export { BaseBlock, type BaseBlockSnapshot };
