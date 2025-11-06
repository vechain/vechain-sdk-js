import { BlockRef, HexUInt32, type Hex } from '@common/vcdm';
import { type RegularBlockResponse } from '@thor/thorest/blocks/response';
import { BaseBlock } from './BaseBlock';

/**
 * A block that contains only the transaction IDs.
 */
class Block extends BaseBlock {
    readonly transactions: HexUInt32[];
    private readonly _response: RegularBlockResponse;

    /**
     * Constructs a new instance of the class from the thorest response.
     *
     * @param {RegularBlockResponse} response - The thorest response to construct the instance from.
     */
    private constructor(response: RegularBlockResponse) {
        super(BaseBlock.snapshotFromResponse(response));
        this.transactions = response.transactions.map((hex: Hex) =>
            HexUInt32.of(hex)
        );
        this._response = response;
    }

    /**
     * Returns the blockRef of the block.
     *
     * @returns {BlockRef} The blockRef of the block.
     */
    public getBlockRef(): BlockRef {
        return BlockRef.of(this.id);
    }

    /**
     * Creates a new instance of the class from the thorest response.
     *
     * @param {RegularBlockResponse | null} response - The thorest response to construct the instance from.
     * @returns {Block | null} A new instance of the class.
     */
    public static fromResponse(
        response: RegularBlockResponse | null
    ): Block | null {
        return response === null ? null : new Block(response);
    }
}

export { Block };
