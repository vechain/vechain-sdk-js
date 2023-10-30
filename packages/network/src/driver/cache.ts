import { LRUCache } from 'lru-cache';
import {
    type Block,
    type Account,
    type ThorStatus,
    type Transaction,
    type TransactionReceipt
} from '../types';
import { bloom as bloomUtil } from '@vechain-sdk/core';
/**
 * Constant that defines the window length used for determining irreversibility.
 */
const WINDOW_LEN = 12;

/**
 * Represents a Slot in the cache, combining information about a block, accounts, transactions, receipts, and a tied map.
 */
type Slot = ThorStatus['head'] & {
    bloom?: ReturnType<typeof bloomUtil.distribute>; // Bloom filter for the block.
    block?: Block; // Holds a reference to a blockchain block if available.
    accounts: Map<string, Account>; // Map of accounts.
    txs: Map<string, Transaction>; // Map of transactions.
    receipts: Map<string, TransactionReceipt>; // Map of transaction receipts.
    tied: Map<string, unknown>; // Map of tied objects.
};

/**
 * Cache class for managing caching of Thor blockchain data.
 */
class Cache {
    /**
     * Irreversible cache for blocks, transactions, and receipts using LRUCache.
     */
    private readonly irreversible = {
        blocks: new LRUCache<number | string, Block>({
            max: 256
        }), // Cache for storing blockchain blocks.
        txs: new LRUCache<string, Transaction>({
            max: 512
        }), // Cache for storing transactions.
        receipts: new LRUCache<string, TransactionReceipt>({
            max: 512
        }) // Cache for storing transaction receipts.
    };

    /**
     * Window to store Slot objects.
     */
    private readonly window: Slot[] = [];

    public handleNewBlock(
        head: ThorStatus['head'],
        bloom?: { bits: string; k: number },
        block?: Block
    ): void {
        while (this.window.length > 0) {
            const top = this.window[this.window.length - 1];
            if (top.id === head.id) {
                return;
            }
            if (top.id === head.parentID) {
                break;
            }
            this.window.pop();
        }

        this.window.push({
            ...head,
            bloom:
                bloom != null
                    ? bloomUtil.distribute(
                          bloomUtil.hash(
                              Buffer.from(bloom.bits.slice(2), 'hex')
                          ),
                          bloom.k,
                          2, // ??
                          (index, bit) => bit === index
                      )
                    : undefined,
            block,
            accounts: new Map<string, Account>(),
            txs: new Map<string, Transaction>(),
            receipts: new Map<string, TransactionReceipt>(),
            tied: new Map<string, unknown>()
        });

        // shift out old slots and move cached items into frozen cache
        while (this.window.length > WINDOW_LEN) {
            const bottom = this.window.shift();
            if (bottom != null) {
                bottom.txs.forEach((v, k) => this.irreversible.txs.set(k, v));
                bottom.receipts.forEach((v, k) =>
                    this.irreversible.receipts.set(k, v)
                );
                if (bottom.block != null) {
                    this.irreversible.blocks.set(bottom.block.id, bottom.block);
                    this.irreversible.blocks.set(
                        bottom.block.number,
                        bottom.block
                    );
                }
            }
        }
    }

    /**
     * Retrieves a block based on its revision (number or ID).
     *
     * @param revision - The revision (number or ID) of the block to fetch.
     * @param fetch - A function that fetches the block if not found in the cache.
     * @returns A Promise that resolves to the fetched block or null if not found.
     */
    public async getBlock(
        revision: number | string,
        fetch: () => Promise<Block | null | undefined>
    ): Promise<Block | null | undefined> {
        let block = this.irreversible.blocks.get(revision) ?? null;
        console.log('block', revision, block);

        // If the block is found in the irreversible cache, return it.
        if (block != null) {
            return block;
        }

        const { slot } = this.findSlot(revision);
        console.log('slot', revision, slot);

        // If the block is available in a slot, return it.
        if (slot?.block != null) {
            return slot.block;
        }

        block = (await fetch()) ?? null;
        console.log('block2', revision, block);

        // If a block is fetched, update the cache.
        if (block != null) {
            if (slot != null && slot.id === block.id) {
                slot.block = block;
            }
            console.log('irreversible', this.isIrreversible(block.number));
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

export { Cache };
