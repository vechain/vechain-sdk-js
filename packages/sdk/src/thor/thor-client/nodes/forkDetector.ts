import { Revision } from '@common/vcdm';
import { type HttpClient } from '@common/http';
import { ThorError } from '@thor/thorest';

// In-memory cache for fork detection results
interface CacheEntry {
    result: boolean;
    timestamp: number;
}

class ForkDetector {
    constructor(private readonly httpClient: HttpClient) {}

    private static readonly galacticaForkCache = new Map<
        Revision,
        CacheEntry
    >();
    private static readonly NEGATIVE_CACHE_TTL = 5 * 60 * 1000;
    private static galacticaForkDetected = false;

    /**
     * Checks if the given block is Galactica-forked by inspecting the block details.
     *
     * Criteria:
     * - baseFeePerGas is defined (indicating a possible Galactica fork).
     *
     * @param revision Block number or ID (e.g., 'best', 'finalized', or numeric).
     * @returns `true` if Galactica-forked, otherwise `false`.
     * @throws {ThorError} If unable to get block details.
     */
    public async isGalacticaForked(revision?: Revision): Promise<boolean> {
        // If we've already detected Galactica fork on any revision, return true immediately
        // This is because once a hard fork happens, it's permanent
        if (ForkDetector.galacticaForkDetected) {
            return true;
        }
        if (revision === undefined) {
            revision = Revision.BEST;
        }
        // Check cache first
        const cachedResult = ForkDetector.galacticaForkCache.get(revision);
        const now = Date.now();

        // If we have a cached positive result or a non-expired negative result
        if (cachedResult !== undefined) {
            // Positive results are kept indefinitely
            if (cachedResult.result) {
                ForkDetector.galacticaForkDetected = true;
                return true;
            }
            // Negative results expire after TTL
            if (
                now - cachedResult.timestamp <
                ForkDetector.NEGATIVE_CACHE_TTL
            ) {
                return false;
            }
        }
        // If cache miss or expired negative result, make the request
        const response = await this.httpClient.get(
            { path: `/blocks/${revision}` },
            { query: '' }
        );

        // We already checked the cache so no need to check it again here
        if (!response.ok) {
            throw new ThorError(
                'ForkDetector.isGalacticaForked()',
                'Network error: failed to get block details and no cached result found',
                { revision },
                undefined,
                response.status
            );
        }

        if (response === null) {
            // Cache the negative result with TTL
            ForkDetector.galacticaForkCache.set(revision, {
                result: false,
                timestamp: now
            });
            return false;
        }

        const blockData = await response.json();

        if (blockData === null) {
            // Cache the negative result with TTL
            ForkDetector.galacticaForkCache.set(revision, {
                result: false,
                timestamp: now
            });
            return false;
        }

        const result = blockData.baseFeePerGas !== undefined;

        // Cache the result
        ForkDetector.galacticaForkCache.set(revision, {
            result,
            timestamp: now
        });

        // If fork is detected, set the global flag
        if (ForkDetector.galacticaForkDetected) {
            ForkDetector.galacticaForkDetected = true;
        }

        return result;
    }

    /**
     * Clears the Galactica fork detection cache.
     * This is mainly useful for testing purposes.
     */
    public clearCache(): void {
        ForkDetector.galacticaForkCache.clear();
        ForkDetector.galacticaForkDetected = false;
    }
}

export { ForkDetector };
