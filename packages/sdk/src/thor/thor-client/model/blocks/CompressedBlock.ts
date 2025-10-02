import { type RegularBlockResponse } from '@thor/thorest/blocks/response';

class CompressedBlock {
    readonly data: RegularBlockResponse;

    private constructor(response: RegularBlockResponse) {
        this.data = response;
    }

    public static fromResponse(
        response: RegularBlockResponse | null
    ): CompressedBlock | null {
        return response === null ? null : new CompressedBlock(response);
    }

    public get number(): number {
        return this.data.number;
    }

    public get id(): string {
        return this.data.id.toString();
    }

    public get baseFeePerGas(): bigint | undefined {
        return this.data.baseFeePerGas;
    }

    public get transactions(): string[] {
        return this.data.transactions.map((hex) => hex.toString());
    }
}

export { CompressedBlock };

