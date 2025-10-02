import { type Hex } from '@common/vcdm';
import { type RegularBlockResponse } from '@thor/thorest/blocks/response';

class Block {
    readonly data: RegularBlockResponse;

    private constructor(response: RegularBlockResponse) {
        this.data = response;
    }

    public static fromResponse(
        response: RegularBlockResponse | null
    ): Block | null {
        return response === null ? null : new Block(response);
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

    public get isTrunk(): boolean {
        return this.data.isTrunk;
    }

    public get isFinalized(): boolean {
        return this.data.isFinalized;
    }

    public get transactions(): string[] {
        return this.data.transactions.map((hex: Hex) => hex.toString());
    }
}

export { Block };
