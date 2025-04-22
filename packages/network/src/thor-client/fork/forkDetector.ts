import { InvalidDataType } from '@vechain/sdk-errors';
import { buildQuery, thorest } from '../../utils';
import { type BlockDetail } from '../blocks/types';
import { Revision } from '@vechain/sdk-core';
import { type HttpClient, HttpMethod } from '../../http';

class ForkDetector {
    constructor(private readonly httpClient: HttpClient) {}

    /**
     * Checks if the given block is Galactica-forked by inspecting the block details.
     *
     * Criteria:
     * - baseFeePerGas is defined (indicating a possible Galactica fork).
     *
     * @param revision Block number or ID (e.g., 'best', 'finalized', or numeric).
     * @returns `true` if Galactica-forked, otherwise `false`.
     * @throws {InvalidDataType} If the revision is invalid.
     */
    public async isGalacticaForked(
        revision?: string | number
    ): Promise<boolean> {
        revision ??= 'best';
        if (!Revision.isValid(revision)) {
            throw new InvalidDataType(
                'GalacticaForkDetector.isGalacticaForked()',
                'Invalid revision. Must be a valid block number or ID.',
                { revision }
            );
        }

        const block = (await this.httpClient.http(
            HttpMethod.GET,
            thorest.blocks.get.BLOCK_DETAIL(revision),
            {
                query: buildQuery({ expanded: true })
            }
        )) as BlockDetail | null;

        if (block === null) return false;

        return block.baseFeePerGas !== undefined;
    }

    /**
     * Detects if the current network is on the Galactica fork by checking the best block.
     * This is an alias for isGalacticaForked('best').
     *
     * @param {string | number} revision - Block number or ID (e.g., 'best', 'finalized', or numeric)
     * @returns {Promise<boolean>} A promise that resolves to true if Galactica fork is detected, false otherwise.
     */
    public async detectGalactica(
        revision: string | number = 'best'
    ): Promise<boolean> {
        return await this.isGalacticaForked(revision);
    }
}

export { ForkDetector };
