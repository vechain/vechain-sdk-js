import { type BlockRef, Revision } from '@common/vcdm';
import { AbstractThorModule } from '../AbstractThorModule';
import {
    RetrieveExpandedBlock,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    type ExpandedBlockResponse,
    type RawBlockResponse,
    type RegularBlockResponse
} from '@thor/thorest';
import { Block, ExpandedBlock, RawBlock } from '../model/blocks';

class BlocksModule extends AbstractThorModule {
    /**
     * Retrieves a regular (compressed) block for the provided revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlock(
        revision: Revision = Revision.BEST
    ): Promise<Block | null> {
        const response = await this.fetchBlock(revision);
        return Block.fromResponse(response);
    }

    /**
     * Retrieves an expanded block (including full transactions) for a revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlockExpanded(
        revision: Revision = Revision.BEST
    ): Promise<ExpandedBlock | null> {
        const response = await this.fetchExpandedBlock(revision);
        return ExpandedBlock.fromResponse(response);
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
}

export { BlocksModule };
