import { InvalidDataType } from '@vechain/sdk-errors';
import { buildQuery, thorest } from '../../utils';
import { type BlockDetail } from '../blocks/types';
import { Revision } from '@vechain/sdk-core';
import { type HttpClient, HttpMethod } from '../../http';

class GalacticaForkDetector {
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
    public async isGalacticaForked(revision: string | number): Promise<boolean> {
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

        if (!block) return false;

        // Check if baseFeePerGas is defined in the block details
        return block.baseFeePerGas !== undefined;
    }
}

export { GalacticaForkDetector };
