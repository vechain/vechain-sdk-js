import { type Hex } from '@common/vcdm';
import { type RegularBlockResponse } from '@thor/thorest/blocks/response';
import { BaseBlock, type BaseBlockSnapshot } from './BaseBlock';

class Block extends BaseBlock {
    readonly transactions: string[];

    private constructor(response: RegularBlockResponse) {
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
        this.transactions = response.transactions.map((hex: Hex) =>
            hex.toString()
        );
    }

    public static fromResponse(
        response: RegularBlockResponse | null
    ): Block | null {
        return response === null ? null : new Block(response);
    }
}

export { Block };
