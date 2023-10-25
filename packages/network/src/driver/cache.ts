import { LRUCache } from 'lru-cache';

const WINDOW_LEN = 12;

type Slot = Connex.Thor.Status['head'] & {
    block?: Connex.Thor.Block;

    accounts: Map<string, Account>;
    txs: Map<string, Connex.Thor.Transaction>;
    receipts: Map<string, Connex.Thor.Transaction.Receipt>;
    tied: Map<string, never>;
};

export class Cache {
    private readonly irreversible = {
        blocks: new LRUCache<number | string, Connex.Thor.Block>({
            max: 256
        }),
        txs: new LRUCache<string, Connex.Thor.Transaction>({ max: 512 }),
        receipts: new LRUCache<string, Connex.Thor.Transaction.Receipt>({
            max: 512
        })
    };

    private readonly window: Slot[] = [];

    public async getBlock(
        revision: number | string,
        fetch: () => Promise<Connex.Thor.Block | null | undefined>
    ): Promise<Connex.Thor.Block | null | undefined> {
        let block = this.irreversible.blocks.get(revision) ?? null;
        if (block != null) {
            return block;
        }

        const { slot } = this.findSlot(revision);

        if (slot?.block != null) {
            return slot.block;
        }

        block = (await fetch()) ?? null;
        if (block != null) {
            if (slot != null && slot.id === block.id) {
                slot.block = block;
            }

            const a = block.number;
            this.isIrreversible(a);

            if (this.isIrreversible(block.number)) {
                this.irreversible.blocks.set(block.id, block);
                if (block.isTrunk) {
                    this.irreversible.blocks.set(block.number, block);
                }
            }
        }
        return block;
    }

    private findSlot(revision: string | number): {
        slot?: Slot;
        index: number;
    } {
        const index = this.window.findIndex(
            (s) => s.id === revision || s.number === revision
        );
        if (index >= 0) {
            return { slot: this.window[index], index };
        }
        return { index };
    }

    private isIrreversible(n: number): boolean {
        if (this.window.length > 0) {
            return n < this.window[this.window.length - 1].number - WINDOW_LEN;
        }
        return false;
    }
}

class Account {
    constructor(
        readonly obj: Connex.Thor.Account,
        readonly initTimestamp: number
    ) {}

    // public snapshot(timestamp: number) {
    //     return { ...this.obj, energy: this.energyAt(timestamp) };
    // }

    // private energyAt(timestamp: number) {
    //     if (timestamp < this.initTimestamp) {
    //         return this.obj.energy;
    //     }
    //     return (
    //         '0x' +
    //         new BigNumber(this.obj.balance)
    //             .times(timestamp - this.initTimestamp)
    //             .times(ENERGY_GROWTH_RATE)
    //             .dividedToIntegerBy(1e18)
    //             .plus(this.obj.energy)
    //             .toString(16)
    //     );
    // }
}
