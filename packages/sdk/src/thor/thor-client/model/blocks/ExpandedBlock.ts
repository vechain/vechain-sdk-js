import { type ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type TxWithReceipt } from '@thor/thorest/transactions/model';
import { BaseBlock, type BaseBlockSnapshot } from './BaseBlock';

class ExpandedBlock extends BaseBlock {
    readonly transactions: TxWithReceipt[];

    private constructor(response: ExpandedBlockResponse) {
        const snapshot: BaseBlockSnapshot = {
            number: response.number,
            id: response.id.toString(),
            size: response.size,
            parentID: response.parentID.toString(),
            timestamp: response.timestamp,
            gasLimit: response.gasLimit,
            beneficiary: response.beneficiary.toString(),
            gasUsed: response.gasUsed,
            baseFeePerGas: response.baseFeePerGas,
            totalScore: response.totalScore,
            txsRoot: response.txsRoot.toString(),
            txsFeatures: response.txsFeatures,
            stateRoot: response.stateRoot.toString(),
            receiptsRoot: response.receiptsRoot.toString(),
            com: response.com,
            signer: response.signer.toString(),
            isTrunk: response.isTrunk,
            isFinalized: response.isFinalized
        };

        super(snapshot);
        this.transactions = response.transactions;
    }

    public static fromResponse(
        response: ExpandedBlockResponse | null
    ): ExpandedBlock | null {
        return response === null ? null : new ExpandedBlock(response);
    }
}

export { ExpandedBlock };
