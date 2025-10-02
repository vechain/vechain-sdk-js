import { type ExpandedBlockResponse } from '@thor/thorest/blocks/response';

class ExpandedBlock {
    readonly data: ExpandedBlockResponse;

    private constructor(response: ExpandedBlockResponse) {
        this.data = response;
    }

    public static fromResponse(
        response: ExpandedBlockResponse | null
    ): ExpandedBlock | null {
        return response === null ? null : new ExpandedBlock(response);
    }

    public get number(): number {
        return this.data.number;
    }

    public get transactions() {
        return this.data.transactions;
    }

    public get id(): string {
        return this.data.id.toString();
    }

    public get baseFeePerGas(): bigint | undefined {
        return this.data.baseFeePerGas;
    }
}

export { ExpandedBlock };

