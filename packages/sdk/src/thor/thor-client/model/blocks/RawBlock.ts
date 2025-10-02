import { type RawBlockResponse } from '@thor/thorest/blocks/response';

class RawBlock {
    readonly data: RawBlockResponse;

    private constructor(response: RawBlockResponse) {
        this.data = response;
    }

    public static fromResponse(
        response: RawBlockResponse | null
    ): RawBlock | null {
        return response === null ? null : new RawBlock(response);
    }

    public get raw(): string {
        return this.data.raw.toString();
    }
}

export { RawBlock };
