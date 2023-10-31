import { LRUCache } from 'lru-cache';
import { type Block } from '../types';

/**
 * Cache class for managing caching of Thor blockchain data.
 */
class Cache {
    /**
     * Cache for blocks using LRUCache.
     */
    private readonly cached = {
        blocks: new LRUCache<number | string, Block>({
            max: 256
        }) // Cache for storing blockchain blocks.
    };

    /**
     * Retrieves a block based on its revision (number or ID).
     *
     * @param id - The ID of the block to fetch.
     * @param fetch - A function that fetches the block if not found in the cache.
     * @returns A Promise that resolves to the fetched block or null if not found.
     */
    public async getBlock(
        id: number | string,
        fetch: () => Promise<Block | null | undefined>
    ): Promise<Block | null> {
        let block = this.cached.blocks.get(id) ?? null;

        // If the block is found in the cache, return it.
        if (block != null) {
            return block;
        }

        block = (await fetch()) ?? null;

        if (block != null) {
            // Cache the block.
            this.cached.blocks.set(block.id, block);
        }

        return block;
    }
}

export { Cache };
