import { BlockRef, HexUInt32, type Hex } from '@common/vcdm';
import { type RegularBlockResponse } from '@thor/thorest/blocks/response';
import { BaseBlock } from './BaseBlock';

class Block extends BaseBlock {
    readonly transactions: HexUInt32[];

    private constructor(response: RegularBlockResponse) {
        super(BaseBlock.snapshotFromResponse(response));
        this.transactions = response.transactions.map((hex: Hex) =>
            HexUInt32.of(hex)
        );
    }

    public getBlockRef(): BlockRef {
        return BlockRef.of(this.id);
    }

    public static fromResponse(
        response: RegularBlockResponse | null
    ): Block | null {
        return response === null ? null : new Block(response);
    }
}

export { Block };
