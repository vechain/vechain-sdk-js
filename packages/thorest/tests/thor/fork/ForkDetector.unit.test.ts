import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { ForkDetector } from '@thor/fork/forkDetector';
import { IllegalArgumentError } from '@vechain/sdk-core';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockUnitTestClient';

/**
 * @group unit/fork
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

            const result = await detector.isGalacticaForked('best');

            expect(result).toBe(true);
        });

        test('should return false when baseFeePerGas is undefined', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.isGalacticaForked('best');

            expect(result).toBe(false);
        });

        test('should return false when block is null', async () => {
            const client = mockHttpClient(null, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.isGalacticaForked(999999);

            expect(result).toBe(false);
        });

        test('should throw IllegalArgumentError for invalid revision', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const detector = new ForkDetector(client);

            await expect(
                detector.isGalacticaForked('invalid-revision')
            ).rejects.toThrow(IllegalArgumentError);
        });

        test('should use "best" as default revision', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const getSpy = jest.spyOn(client, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked();

            expect(getSpy).toHaveBeenCalledWith(
                { path: '/blocks/best' },
                { query: '' }
            );
        });

        test('should work with numeric revision', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const getSpy = jest.spyOn(client, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.isGalacticaForked(123456);

            expect(result).toBe(true);
            expect(getSpy).toHaveBeenCalledWith(
                { path: '/blocks/123456' },
                { query: '' }
            );
        });

        test('should cache positive results', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const getSpy = jest.spyOn(client, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked('best');
            await detector.isGalacticaForked('best');

            expect(getSpy).toHaveBeenCalledTimes(1);
        });

        test('should cache negative results temporarily', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const getSpy = jest.spyOn(client, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked('best');
            await detector.isGalacticaForked('best');

            expect(getSpy).toHaveBeenCalledTimes(1);
        });

        test('should handle HTTP errors gracefully', async () => {
            const client = mockHttpClientWithError('Network error', 'get');
            const detector = new ForkDetector(client);
            const isGalacticaForkedSpy = jest.spyOn(
                detector,
                'isGalacticaForked'
            );

            await expect(detector.isGalacticaForked('best')).rejects.toThrow(
                'Network error'
            );
            expect(isGalacticaForkedSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('detectGalactica', () => {
        test('should be an alias for isGalacticaForked', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.detectGalactica();

            expect(result).toBe(true);
        });

        test('should accept custom revision', async () => {
            const client = mockHttpClient({ baseFeePerGas: undefined }, 'get');
            const getSpy = jest.spyOn(client, 'get');
            const detector = new ForkDetector(client);

            const result = await detector.detectGalactica('finalized');

            expect(result).toBe(false);
            expect(getSpy).toHaveBeenCalledWith(
                { path: '/blocks/finalized' },
                { query: '' }
            );
        });
    });

    describe('clearCache', () => {
        test('should clear cache and allow fresh requests', async () => {
            const client = mockHttpClient({ baseFeePerGas: '0x1' }, 'get');
            const getSpy = jest.spyOn(client, 'get');
            const detector = new ForkDetector(client);

            await detector.isGalacticaForked('best');
            detector.clearCache();
            await detector.isGalacticaForked('best');

            expect(getSpy).toHaveBeenCalledTimes(2);
        });
    });
});
