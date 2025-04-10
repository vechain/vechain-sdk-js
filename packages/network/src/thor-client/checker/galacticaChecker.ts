import { InvalidDataType } from '@vechain/sdk-errors';
import { buildQuery, thorest } from '../../utils';
import {
    type ExpandedBlockDetail,
    type TransactionsExpandedBlockDetail
} from './types';
import { Revision } from '@vechain/sdk-core';
import { type HttpClient, HttpMethod } from '../../http';

class GalacticaForkDetector {
    constructor(private readonly httpClient: HttpClient) {}

    /**
     * Checks if the given block is Galactica-forked by inspecting its transactions.
     *
     * Criteria:
     * - Transaction type is 0x51 (81).
     * - Presence of any of:
     *   - maxFeePerGas
     *   - maxPriorityFeePerGas
     *   - gasPriceCoef being undefined (i.e., optional)
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
        )) as ExpandedBlockDetail | null;

        if (!block) return false;
        return block.transactions.some((tx: TransactionsExpandedBlockDetail) => {
            const hasEIP1559Fields =
                (tx as any).maxFeePerGas !== undefined ||
                (tx as any).maxPriorityFeePerGas !== undefined;
            const gasPriceCoefIsOptional = tx.gasPriceCoef === undefined;
        
            return (hasEIP1559Fields || gasPriceCoefIsOptional);
        });
    }
}

export { GalacticaForkDetector };
