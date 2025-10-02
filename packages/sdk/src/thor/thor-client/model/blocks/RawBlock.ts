import { type RawBlockResponse } from '@thor/thorest/blocks/response';

class RawBlock {
    readonly raw: string;

    private constructor(response: RawBlockResponse) {
        this.raw = response.raw.toString();
    }

    public static fromResponse(
        response: RawBlockResponse | null
    ): RawBlock | null {
        return response === null ? null : new RawBlock(response);
    }
}

export { RawBlock };
