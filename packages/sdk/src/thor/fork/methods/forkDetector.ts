import { InvalidDataType } from '@vechain/sdk-core-errors';
import { Revision } from '@vcdm';
import { HttpClient } from '@http';

// In-memory cache for fork detection results
interface CacheEntry {
    result: boolean;
    timestamp: number;
}
const galacticaForkCache = new Map<string, CacheEntry>();
// Cache TTL in milliseconds for negative results (5 minutes)
const NEGATIVE_CACHE_TTL = 5 * 60 * 1000;
// Track if we've found the Galactica fork on any revision
let galacticaForkDetected = false;

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
        // If we've already detected Galactica fork on any revision, return true immediately
        // This is because once a hard fork happens, it's permanent
        if (galacticaForkDetected) {
            return true;
        }

        if (revision === undefined) {
            revision = 'best';
        }
        if (!Revision.isValid(revision)) {
            throw new InvalidDataType(
                'GalacticaForkDetector.isGalacticaForked()',
                'Invalid revision. Must be a valid block number or ID.',
                { revision }
            );
        }

        const revisionKey = String(revision);

        // Check cache first
        const cachedResult = galacticaForkCache.get(revisionKey);
        const now = Date.now();

        // If we have a cached positive result or a non-expired negative result
        if (cachedResult !== undefined) {
            // Positive results are kept indefinitely
            if (cachedResult.result) {
                galacticaForkDetected = true;
                return true;
            }

            // Negative results expire after TTL
            if (now - cachedResult.timestamp < NEGATIVE_CACHE_TTL) {
                return false;
            }
        }

        // If cache miss or expired negative result, make the request
        const block = await this.httpClient.get(
            { path: `/blocks/${revision}` },
            { query: '' }
        );

        if (block === null) {
            // Cache the negative result with TTL
            galacticaForkCache.set(revisionKey, {
                result: false,
                timestamp: now
            });
            return false;
        }

        const blockData = await block.json();

        if (blockData === null) {
            // Cache the negative result with TTL
            galacticaForkCache.set(revisionKey, {
                result: false,
                timestamp: now
            });
            return false;
        }

        const result = blockData.baseFeePerGas !== undefined;

        // Cache the result
        galacticaForkCache.set(revisionKey, { result, timestamp: now });

        // If fork is detected, set the global flag
        if (result) {
            galacticaForkDetected = true;
        }

        return result;
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

    /**
     * Clears the Galactica fork detection cache.
     * This is mainly useful for testing purposes.
     */
    public clearCache(): void {
        galacticaForkCache.clear();
        galacticaForkDetected = false;
    }
}

export { ForkDetector };
