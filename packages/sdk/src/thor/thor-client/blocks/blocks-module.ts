import { IllegalArgumentError } from '@common/errors';
import { BlockRef, Revision } from '@common/vcdm';
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

type RevisionInput = Parameters<typeof Revision.of>[0];

class BlocksModule extends AbstractThorModule {
    /**
     * Retrieves a regular (compressed) block for the provided revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlock(
        revision: RevisionInput = 'best'
    ): Promise<Block | null> {
        const response = await this.fetchBlock(revision);
        return Block.fromResponse(response);
    }

    /**
     * Retrieves an expanded block (including full transactions) for a revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlockExpanded(
        revision: RevisionInput = 'best'
    ): Promise<ExpandedBlock | null> {
        const response = await this.fetchExpandedBlock(revision);
        return ExpandedBlock.fromResponse(response);
    }

    /**
     * Retrieves the raw block payload for a revision.
     * Defaults to the best block when no revision is supplied.
     */
    public async getBlockRaw(
        revision: RevisionInput = 'best'
    ): Promise<RawBlock | null> {
        const response = await this.fetchRawBlock(revision);
        return RawBlock.fromResponse(response);
    }

    /**
     * Returns the `BlockRef` for the current best block.
     */
    public async getBestBlockRef(): Promise<BlockRef | null> {
        const block = await this.getBlock('best');
        if (block === null) {
            return null;
        }
        return BlockRef.of(block.id);
    }

    /**
     * Retrieves the genesis block (revision 0).
     */
    public async getGenesisBlock(): Promise<Block | null> {
        return await this.getBlock(0);
    }

    private async fetchBlock(
        revision: RevisionInput
    ): Promise<RegularBlockResponse | null> {
        const query = RetrieveRegularBlock.of(Revision.of(revision));
        const answer = await query.askTo(this.httpClient);
        this.ensureRevision(answer.response, revision);
        return answer.response;
    }

    private async fetchExpandedBlock(
        revision: RevisionInput
    ): Promise<ExpandedBlockResponse | null> {
        const query = RetrieveExpandedBlock.of(Revision.of(revision));
        const answer = await query.askTo(this.httpClient);
        this.ensureRevision(answer.response, revision);
        return answer.response;
    }

    private async fetchRawBlock(
        revision: RevisionInput
    ): Promise<RawBlockResponse | null> {
        const query = RetrieveRawBlock.of(Revision.of(revision));
        const answer = await query.askTo(this.httpClient);
        return answer.response;
    }

    private ensureRevision(
        response: { number?: number | null } | null,
        requested: RevisionInput
    ): void {
        if (response === null) {
            return;
        }

        if (
            typeof requested === 'number' &&
            response.number !== undefined &&
            response.number !== null &&
            response.number !== requested
        ) {
            throw new IllegalArgumentError(
                'BlocksModule.ensureRevision',
                'Unexpected block number in response',
                { requested, received: response.number }
            );
        }
    }
}

export { BlocksModule };
