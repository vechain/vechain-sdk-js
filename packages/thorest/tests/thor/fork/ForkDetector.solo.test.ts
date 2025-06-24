import { describe, expect, test, beforeEach } from '@jest/globals';
import { ForkDetector } from '@thor/fork/forkDetector';
import { FetchHttpClient } from '@http';
import { ThorNetworks } from '@thor';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * @group integration/fork
 */
describe('ForkDetector SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);
    let forkDetector: ForkDetector;

    beforeEach(() => {
        forkDetector = new ForkDetector(httpClient);
        // Clear cache before each test to ensure clean state
        forkDetector.clearCache();
    });

    describe('isGalacticaForked', () => {
        test('should detect fork status for genesis block (block 0)', async () => {
            const result = await forkDetector.isGalacticaForked(0);

            // Genesis block should not have Galactica fork features
            expect(result).toBe(false);
        });

        test('should detect fork status for best block', async () => {
            const result = await forkDetector.isGalacticaForked('best');

            expect(result).toBe(true);
        });

        test('should handle revision parameter validation', async () => {
            const result = await forkDetector.isGalacticaForked(0);
            expect(result).toBe(false);
        });

        test('should throw InvalidDataType for invalid revision', async () => {
            await expect(
                forkDetector.isGalacticaForked('invalid-revision')
            ).rejects.toThrow(InvalidDataType);
        });

        test('should use default (best)revision when undefined', async () => {
            const result = await forkDetector.isGalacticaForked();

            expect(result).toBe(true);
        });

        test('should handle different revisions independently', async () => {
            const bestResult = await forkDetector.isGalacticaForked('best');
            const finalizedResult =
                await forkDetector.isGalacticaForked('finalized');
            const block0Result = await forkDetector.isGalacticaForked(0);

            // All should return boolean values
            expect(typeof bestResult).toBe('boolean');
            expect(typeof finalizedResult).toBe('boolean');
            expect(typeof block0Result).toBe('boolean');
        });
    });

    describe('detectGalactica', () => {
        test('should work as alias for isGalacticaForked with default revision', async () => {
            const directResult = await forkDetector.isGalacticaForked('best');

            // Clear cache to ensure fresh call
            forkDetector.clearCache();

            const aliasResult = await forkDetector.detectGalactica();

            expect(aliasResult).toBe(directResult);
        });

        test('should accept custom revision parameter', async () => {
            const result = await forkDetector.detectGalactica('finalized');

            expect(typeof result).toBe('boolean');
        });

        test('should work with numeric revision', async () => {
            const result = await forkDetector.detectGalactica(0);

            expect(typeof result).toBe('boolean');
        });
    });

    describe('clearCache', () => {
        test('should reset cache and allow fresh network calls', async () => {
            // First call to populate cache
            await forkDetector.isGalacticaForked('best');

            // Clear cache
            forkDetector.clearCache();

            // Second call should work correctly (making fresh network request)
            const result = await forkDetector.isGalacticaForked('best');

            expect(typeof result).toBe('boolean');
        });
    });

    describe('edge cases', () => {
        test('should handle rapid sequential calls', async () => {
            const promises = [
                forkDetector.isGalacticaForked('best'),
                forkDetector.isGalacticaForked('best'),
                forkDetector.isGalacticaForked('best')
            ];

            const results = await Promise.all(promises);

            // All results should be the same
            expect(results[0]).toBe(results[1]);
            expect(results[1]).toBe(results[2]);
        });

        test('should handle mixed revision types', async () => {
            const results = await Promise.all([
                forkDetector.isGalacticaForked(0),
                forkDetector.isGalacticaForked('best'),
                forkDetector.isGalacticaForked('finalized')
            ]);

            // All should return boolean values
            results.forEach((result) => {
                expect(typeof result).toBe('boolean');
            });
        });

        test('should be consistent across multiple instances', async () => {
            const detector1 = new ForkDetector(httpClient);
            const detector2 = new ForkDetector(httpClient);

            const result1 = await detector1.isGalacticaForked('best');
            const result2 = await detector2.isGalacticaForked('best');

            // Both detectors should give the same result for the same revision
            expect(result1).toBe(result2);
        });
    });

    describe('network resilience', () => {
        test('should handle network timeouts gracefully', async () => {
            // This test ensures the detector doesn't hang indefinitely
            const timeoutPromise = new Promise((_resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Test timeout'));
                }, 10000); // 10 second timeout
            });

            const detectorPromise = forkDetector.isGalacticaForked('best');

            await expect(
                Promise.race([detectorPromise, timeoutPromise])
            ).resolves.toEqual(expect.any(Boolean));
        }, 15000); // Allow up to 15 seconds for this test
    });
});
