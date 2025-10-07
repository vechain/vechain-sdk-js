import { type Hex } from '@common/vcdm';
import { type RawBlockResponse } from '@thor/thorest/blocks/response';

class RawBlock {
    readonly raw: Hex;

    private constructor(response: RawBlockResponse) {
        this.raw = response.raw;
    }

    public static fromResponse(
        response: RawBlockResponse | null
    ): RawBlock | null {
        return response === null ? null : new RawBlock(response);
    }
}

export { RawBlock };
