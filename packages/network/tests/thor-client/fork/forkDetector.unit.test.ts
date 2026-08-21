import { describe, expect, jest, test, afterEach } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { ForkDetector, type HttpClient } from '../../../src';

/**
 * ForkDetector.isInterstellarForked() unit tests.
 *
 * Interstellar is inferred from the EIP-2935 History Storage account having
 * code, which Thor deploys at the fork block.
 *
 * @group unit/clients/thor-client/fork
 */
describe('ForkDetector.isInterstellarForked() unit tests', () => {
    const historyStorageAddress = '0x0000F90827F1C53a10cb7A02335B175320002935';

    const mockHttp = (response: unknown): HttpClient =>
        ({
            baseURL: 'http://localhost',
            get: jest.fn().mockResolvedValue(response),
            post: jest.fn(),
            http: jest.fn().mockResolvedValue(response)
        }) as unknown as HttpClient;

    afterEach(() => {
        new ForkDetector(mockHttp(null)).clearCache();
    });

    test('true <- History Storage account has code', async () => {
        const httpClient = mockHttp({
            balance: '0x0',
            energy: '0x0',
            hasCode: true
        });
        const detector = new ForkDetector(httpClient);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(true);
        expect(httpClient.http).toHaveBeenCalledWith(
            'GET',
            `/accounts/${historyStorageAddress}`,
            { query: { revision: 'best' } }
        );
    });

    test('false <- History Storage account has no code', async () => {
        const detector = new ForkDetector(
            mockHttp({
                balance: '0x0',
                energy: '0x0',
                hasCode: false
            })
        );
        await expect(detector.isInterstellarForked('best')).resolves.toBe(
            false
        );
    });

    test('false <- History Storage account is missing', async () => {
        const detector = new ForkDetector(mockHttp(null));
        await expect(detector.isInterstellarForked()).resolves.toBe(false);
    });

    test('exception <- invalid revision', async () => {
        const detector = new ForkDetector(mockHttp(null));
        await expect(detector.isInterstellarForked('??')).rejects.toThrow(
            InvalidDataType
        );
    });

    test('true <- cached after the first positive result', async () => {
        const httpClient = mockHttp({
            balance: '0x0',
            energy: '0x0',
            hasCode: true
        });
        const detector = new ForkDetector(httpClient);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(true);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(true);
        expect(httpClient.http).toHaveBeenCalledTimes(1);
    });

    test('true <- detectInterstellar is an alias of isInterstellarForked', async () => {
        const detector = new ForkDetector(
            mockHttp({
                balance: '0x0',
                energy: '0x0',
                hasCode: true
            })
        );
        await expect(detector.detectInterstellar()).resolves.toBe(true);
    });
});
