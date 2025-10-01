import { describe, expect, test, beforeEach } from '@jest/globals';
import { ForkDetector } from '@thor/thor-client/nodes';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../../MockHttpClient';
import { Revision } from '@common/vcdm';

/**
 * @group unit
 */
describe('ForkDetector unit tests', () => {
    beforeEach(() => {
        // Clear any global state before each test
        const detector = new ForkDetector(mockHttpClient({}, 'get'));
        detector.clearCache();
    });

    describe('constructor', () => {
        test('should create ForkDetector with HttpClient', () => {
            const mockClient = mockHttpClient({}, 'get');
            const detector = new ForkDetector(mockClient);
            expect(detector).toBeInstanceOf(ForkDetector);
        });
    });

    describe('isGalacticaForked', () => {
        test('should return true when baseFeePerGas is defined', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.isGalacticaForked(Revision.BEST);

            expect(result).toBe(true);
        });

        test('should return false when baseFeePerGas is undefined', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.isGalacticaForked(Revision.BEST);

            expect(result).toBe(false);
        });

        test('should return false when block is null', async () => {
            const client = mockHttpClient(null, 'get');
            const detector = new ForkDetector(client);
            const result = await detector.isGalacticaForked(
                Revision.of(999999)
            );
            expect(result).toBe(false);
        });

        test('should use "best" as default revision', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked();

            expect(client.get).toHaveBeenCalledWith(
                { path: '/blocks/best' },
                { query: '' }
            );
        });

        test('should work with numeric revision', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.isGalacticaForked(
                Revision.of(123456)
            );

            expect(result).toBe(true);
            expect(client.get).toHaveBeenCalledWith(
                { path: '/blocks/123456' },
                { query: '' }
            );
        });

        test('should cache positive results', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked(Revision.BEST);
            await detector.isGalacticaForked(Revision.BEST);

            expect(client.get).toHaveBeenCalledTimes(1);
        });

        test('should cache negative results temporarily', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked(Revision.BEST);
            await detector.isGalacticaForked(Revision.BEST);

            expect(client.get).toHaveBeenCalledTimes(1);
        });

        test('should handle HTTP errors gracefully', async () => {
            const client = mockHttpClientWithError('Network error', 'get');
            const detector = new ForkDetector(client);

            await expect(
                detector.isGalacticaForked(Revision.BEST)
            ).rejects.toThrow('HTTP request failed with status 400');
        });
    });

    describe('clearCache', () => {
        test('should clear cache and allow fresh requests', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked(Revision.BEST);
            detector.clearCache();
            await detector.isGalacticaForked(Revision.BEST);

            expect(client.get).toHaveBeenCalledTimes(2);
        });
    });
});
