import { type BlockRef, Revision, RevisionLike } from '@common/vcdm';
import { AbstractThorModule } from '../AbstractThorModule';
import {
    RetrieveExpandedBlock,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    type ExpandedBlockResponse,
    type RawBlockResponse,
    type RegularBlockResponse
} from '@thor/thorest';
import { IllegalArgumentError, TimeoutError } from '@common/errors';
import { waitUntil } from '@common/utils/poller';
import { Block, ExpandedBlock, RawBlock } from '../model/blocks';
import { type WaitForBlockOptions } from '../model/blocks/WaitForBlockOptions';

/**
 * The blocks module of the VeChain Thor blockchain.
 * It allows to retrieve blocks and their transactions
 */
class BlocksModule extends AbstractThorModule {
    /**
     * Retrieves a regular (compressed) block for the provided revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlock(
        revision: RevisionLike = Revision.BEST
    ): Promise<Block | null> {
        const rev = Revision.of(revision);
        const response = await this.fetchBlock(rev);
        return Block.fromResponse(response);
    }

    /**
     * Retrieves an expanded block (including full transactions) for a revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlockExpanded(
        revision: RevisionLike = Revision.BEST
    ): Promise<ExpandedBlock | null> {
        const rev = Revision.of(revision);
        const response = await this.fetchExpandedBlock(rev);
        return ExpandedBlock.fromResponse(response);
    }

    /**
     * Polls Thor until the requested block number becomes available and returns it.
     *
     * @param blockNumber   Height to wait for (inclusive).
     * @param options       Optional polling configuration (interval, timeout, error budget).
     * @returns The block
     * @throws {IllegalArgumentError} If the block number is invalid
     * @throws {TimeoutError} If the block is not found before the timeout
     */
    public async waitForBlock(
        blockNumber: number,
        options?: WaitForBlockOptions
    ): Promise<Block> {
        return (await this.waitForBlockInternal(
            blockNumber,
            options,
            async (revision) => await this.getBlock(revision)
        )) as Block;
    }

    /**
     * Polls the chain until the specified block number is available, returning the expanded (full transactions) payload.
     *
     * @param blockNumber   Height to wait for (inclusive).
     * @param options       Optional polling configuration (interval, timeout, error budget).
     * @returns The expanded block
     * @throws {IllegalArgumentError} If the block number is invalid
     * @throws {TimeoutError} If the block is not found before the timeout
     */
    public async waitForBlockExpanded(
        blockNumber: number,
        options?: WaitForBlockOptions
    ): Promise<ExpandedBlock> {
        return (await this.waitForBlockInternal(
            blockNumber,
            options,
            async (revision) => await this.getBlockExpanded(revision)
        )) as ExpandedBlock;
    }

    /**
     * Retrieves the raw block payload for a revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlockRaw(
        revision: Revision = Revision.BEST
    ): Promise<RawBlock | null> {
        const response = await this.fetchRawBlock(revision);
        return RawBlock.fromResponse(response);
    }

    /**
     * Returns the `BlockRef` for the current best block.
     */
    public async getBestBlockRef(): Promise<BlockRef | null> {
        const block = await this.getBlock(Revision.BEST);
        if (block === null) {
            return null;
        }
        return block.getBlockRef();
    }

    /**
     * Retrieves the genesis block (revision 0).
     */
    public async getGenesisBlock(): Promise<Block | null> {
        return await this.getBlock(Revision.GENESIS);
    }

    private async fetchBlock(
        revision: Revision
    ): Promise<RegularBlockResponse | null> {
        const query = RetrieveRegularBlock.of(revision);
        const answer = await query.askTo(this.httpClient);
        return answer.response;
    }

    private async fetchExpandedBlock(
        revision: Revision
    ): Promise<ExpandedBlockResponse | null> {
        const query = RetrieveExpandedBlock.of(revision);
        const answer = await query.askTo(this.httpClient);
        return answer.response;
    }

    private async fetchRawBlock(
        revision: Revision
    ): Promise<RawBlockResponse | null> {
        const query = RetrieveRawBlock.of(revision);
        const answer = await query.askTo(this.httpClient);
        return answer.response;
    }

    /**
     * Shared wait helper that relies on the poller utilities to deliver the desired block shape.
     * @throws {IllegalArgumentError} If the block number is invalid
     * @throws {TimeoutError} If the block is not found before the timeout
     */
    private async waitForBlockInternal(
        blockNumber: number,
        options: WaitForBlockOptions | undefined,
        resolver: (revision: Revision) => Promise<Block | ExpandedBlock | null>
    ): Promise<Block | ExpandedBlock> {
        const target = Number(blockNumber);
        if (!Number.isFinite(target) || target < 0) {
            throw new IllegalArgumentError(
                'BlocksModule.waitForBlock(blockNumber)',
                'blockNumber must be a non-negative integer',
                { blockNumber }
            );
        }

        const result = await waitUntil({
            task: async () => await resolver(Revision.of(target)),
            predicate: (block) => block !== null && block.number >= target,
            intervalMs: options?.intervalMs,
            timeoutMs: options?.timeoutMs,
            maxNetworkErrors: options?.maxNetworkErrors
        });

        if (result === null) {
            throw new TimeoutError(
                'BlocksModule.waitForBlock()',
                'block was not produced before the timeout',
                { blockNumber: target }
            );
        }

        return result;
    }
}

export { BlocksModule };
