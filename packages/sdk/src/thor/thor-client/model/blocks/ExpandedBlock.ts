import { type ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type TxWithReceipt } from '@thor/thorest/transactions/model';

class ExpandedBlock {
    readonly number: number;

    readonly id: string;

    readonly size: number;

    readonly parentID: string;

    readonly timestamp: number;

    readonly gasLimit: bigint;

    readonly beneficiary: string;

    readonly gasUsed: bigint;

    readonly baseFeePerGas?: bigint;

    readonly totalScore: number;

    readonly txsRoot: string;

    readonly txsFeatures: number;

    readonly stateRoot: string;

    readonly receiptsRoot: string;

    readonly com: boolean;

    readonly signer: string;

    readonly isTrunk: boolean;

    readonly isFinalized: boolean;

    readonly transactions: TxWithReceipt[];

    private constructor(response: ExpandedBlockResponse) {
        this.number = response.number;
        this.id = response.id.toString();
        this.size = response.size;
        this.parentID = response.parentID.toString();
        this.timestamp = response.timestamp;
        this.gasLimit = response.gasLimit;
        this.beneficiary = response.beneficiary.toString();
        this.gasUsed = response.gasUsed;
        this.baseFeePerGas = response.baseFeePerGas;
        this.totalScore = response.totalScore;
        this.txsRoot = response.txsRoot.toString();
        this.txsFeatures = response.txsFeatures;
        this.stateRoot = response.stateRoot.toString();
        this.receiptsRoot = response.receiptsRoot.toString();
        this.com = response.com;
        this.signer = response.signer.toString();
        this.isTrunk = response.isTrunk;
        this.isFinalized = response.isFinalized;
        this.transactions = response.transactions;
    }

    public static fromResponse(
        response: ExpandedBlockResponse | null
    ): ExpandedBlock | null {
        return response === null ? null : new ExpandedBlock(response);
    }
}

export { ExpandedBlock };
