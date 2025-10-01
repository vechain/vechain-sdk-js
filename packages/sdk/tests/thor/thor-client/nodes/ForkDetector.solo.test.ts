import { describe, expect, test, beforeEach } from '@jest/globals';
import { ForkDetector } from '@thor/thor-client/nodes';
import { FetchHttpClient } from '@common/http';
import { ThorNetworks } from '@thor/thorest';
import { IllegalArgumentError } from '@common/errors';
import { Revision } from '@common/vcdm';

/**
 * @group integration/thor/fork
 */
describe('ForkDetector SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    let forkDetector: ForkDetector;

    beforeEach(() => {
        forkDetector = new ForkDetector(httpClient);
        // Clear cache before each test to ensure clean state
        forkDetector.clearCache();
    });

    describe('isGalacticaForked', () => {
        test('should detect fork status for genesis block (block 0)', async () => {
            const result = await forkDetector.isGalacticaForked(Revision.of(0));

            // Genesis block should not have Galactica fork features
            expect(result).toBe(false);
        });

        test('should detect fork status for best block', async () => {
            const result = await forkDetector.isGalacticaForked(Revision.BEST);

            expect(result).toBe(true);
        });

        test('should handle revision parameter validation', async () => {
            const result = await forkDetector.isGalacticaForked(0);
            expect(result).toBe(false);
        });

        test('should use default (best)revision when undefined', async () => {
            const result = await forkDetector.isGalacticaForked();

            expect(result).toBe(true);
        });

        test('should handle different revisions independently', async () => {
            const bestResult = await forkDetector.isGalacticaForked(
                Revision.BEST
            );
            const finalizedResult = await forkDetector.isGalacticaForked(
                Revision.FINALIZED
            );
            const block0Result = await forkDetector.isGalacticaForked(
                Revision.of(0)
            );

            // All should return boolean values
            expect(typeof bestResult).toBe('boolean');
            expect(typeof finalizedResult).toBe('boolean');
            expect(typeof block0Result).toBe('boolean');
        });
    });

    describe('clearCache', () => {
        test('should reset cache and allow fresh network calls', async () => {
            // First call to populate cache
            await forkDetector.isGalacticaForked(Revision.BEST);

            // Clear cache
            forkDetector.clearCache();

            // Second call should work correctly (making fresh network request)
            const result = await forkDetector.isGalacticaForked(Revision.BEST);

            expect(typeof result).toBe('boolean');
        });
    });

    describe('edge cases', () => {
        test('should handle rapid sequential calls', async () => {
            const promises = [
                forkDetector.isGalacticaForked(Revision.BEST),
                forkDetector.isGalacticaForked(Revision.BEST),
                forkDetector.isGalacticaForked(Revision.BEST)
            ];

            const results = await Promise.all(promises);

            // All results should be the same
            expect(results[0]).toBe(results[1]);
            expect(results[1]).toBe(results[2]);
        });

        test('should handle mixed revision types', async () => {
            const results = await Promise.all([
                forkDetector.isGalacticaForked(Revision.of(0)),
                forkDetector.isGalacticaForked(Revision.BEST),
                forkDetector.isGalacticaForked(Revision.FINALIZED)
            ]);

            // All should return boolean values
            results.forEach((result) => {
                expect(typeof result).toBe('boolean');
            });
        });

        test('should be consistent across multiple instances', async () => {
            const detector1 = new ForkDetector(httpClient);
            const detector2 = new ForkDetector(httpClient);

            const result1 = await detector1.isGalacticaForked(Revision.BEST);
            const result2 = await detector2.isGalacticaForked(Revision.BEST);

            // Both detectors should give the same result for the same revision
            expect(result1).toBe(result2);
        });
    });

    describe('network resilience', () => {
        test('should handle network timeouts gracefully', async () => {
            // This test ensures the detector doesn't hang indefinitely
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Test timeout'));
                }, 10000); // 10 second timeout
            });

            const detectorPromise = forkDetector.isGalacticaForked(
                Revision.BEST
            );

            await expect(
                Promise.race([detectorPromise, timeoutPromise])
            ).resolves.toEqual(expect.any(Boolean));
        }, 15000); // Allow up to 15 seconds for this test
    });
});
