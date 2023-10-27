import { LRUCache } from 'lru-cache';

/**
 * Constant that defines the window length used for determining irreversibility.
 */
const WINDOW_LEN = 12;

/**
 * Represents a Slot in the cache, combining information about a block, accounts, transactions, receipts, and a tied map.
 */
type Slot = Connex.Thor.Status['head'] & {
    block?: Connex.Thor.Block; // Holds a reference to a blockchain block if available.
    accounts: Map<string, Account>; // Maps account addresses to Account objects.
    txs: Map<string, Connex.Thor.Transaction>; // Maps transaction IDs to Transaction objects.
    receipts: Map<string, Connex.Thor.Transaction.Receipt>; // Maps transaction IDs to Transaction Receipt objects.
    tied: Map<string, never>; // An empty map for a specific purpose.
};

/**
 * Cache class for managing caching of Thor blockchain data.
 */
class Cache {
    /**
     * Irreversible cache for blocks, transactions, and receipts using LRUCache.
     */
    private readonly irreversible = {
        blocks: new LRUCache<number | string, Connex.Thor.Block>({
            max: 256
        }), // Cache for storing blockchain blocks.
        txs: new LRUCache<string, Connex.Thor.Transaction>({
            max: 512
        }), // Cache for storing transactions.
        receipts: new LRUCache<string, Connex.Thor.Transaction.Receipt>({
            max: 512
        }) // Cache for storing transaction receipts.
    };

    /**
     * Window to store Slot objects.
     */
    private readonly window: Slot[] = [];

    /**
     * Retrieves a block based on its revision (number or ID).
     *
     * @param revision - The revision (number or ID) of the block to fetch.
     * @param fetch - A function that fetches the block if not found in the cache.
     * @returns A Promise that resolves to the fetched block or null if not found.
     */
    public async getBlock(
        revision: number | string,
        fetch: () => Promise<Connex.Thor.Block | null | undefined>
    ): Promise<Connex.Thor.Block | null | undefined> {
        let block = this.irreversible.blocks.get(revision) ?? null;

        // If the block is found in the irreversible cache, return it.
        if (block != null) {
            return block;
        }

        const { slot } = this.findSlot(revision);

        // If the block is available in a slot, return it.
        if (slot?.block != null) {
            return slot.block;
        }

        block = (await fetch()) ?? null;

        // If a block is fetched, update the cache.
        if (block != null) {
            if (slot != null && slot.id === block.id) {
                slot.block = block;
            }

            // Check if the block is irreversible and update the irreversible cache accordingly.
            if (this.isIrreversible(block.number)) {
                this.irreversible.blocks.set(block.id, block);
                if (block.isTrunk) {
                    this.irreversible.blocks.set(block.number, block);
                }
            }
        }
        return block;
    }

    /**
     * Finds the slot associated with the given revision (number or ID).
     *
     * @param revision - The revision (number or ID) to find in the window.
     * @returns An object containing the slot (if found) and its index in the window.
     */
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

    /**
     * Checks if a given block number is irreversible based on the window length.
     *
     * @param n - The block number to check for irreversibility.
     * @returns True if the block is irreversible, otherwise false.
     */
    private isIrreversible(n: number): boolean {
        if (this.window.length > 0) {
            return n < this.window[this.window.length - 1].number - WINDOW_LEN;
        }
        return false;
    }
}

/**
 * Represents an Account with Thor account data and an initialization timestamp.
 */
class Account {
    constructor(
        readonly obj: Connex.Thor.Account,
        readonly initTimestamp: number
    ) {}
}

export { Cache };
