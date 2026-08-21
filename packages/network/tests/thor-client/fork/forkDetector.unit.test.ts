import { describe, expect, jest, test, afterEach } from '@jest/globals';
import { InvalidDataType } from '@vechain/sdk-errors';
import { ForkDetector, type HttpClient } from '../../../src';

/**
 * ForkDetector.isInterstellarForked() unit tests.
 *
 * Interstellar is inferred from the EIP-2935 History Storage account having
 * code. Moving revisions are pinned to a block ID before the account is read
 * or cached.
 *
 * @group unit/clients/thor-client/fork
 */
describe('ForkDetector.isInterstellarForked() unit tests', () => {
    const historyStorageAddress = '0x0000F90827F1C53a10cb7A02335B175320002935';
    const blockIdA =
        '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127';
    const blockIdB =
        '0x0000000011111111111111111111111111111111111111111111111111111111';

    const mockHttp = (handlers: {
        block?: unknown;
        account?: unknown;
        resolveBlock?: (path: string) => unknown;
    }): {
        client: HttpClient;
        http: ReturnType<typeof jest.fn>;
    } => {
        const http = jest.fn((_method: string, path: string) => {
            if (path.startsWith('/blocks/')) {
                if (handlers.resolveBlock !== undefined) {
                    return handlers.resolveBlock(path);
                }
                return handlers.block === undefined
                    ? { id: blockIdA }
                    : handlers.block;
            }
            return handlers.account === undefined
                ? { balance: '0x0', energy: '0x0', hasCode: false }
                : handlers.account;
        });
        return {
            http,
            client: {
                baseURL: 'http://localhost',
                get: jest.fn(),
                post: jest.fn(),
                http
            } as unknown as HttpClient
        };
    };

    afterEach(() => {
        new ForkDetector(mockHttp({}).client).clearCache();
    });

    test('true <- History Storage account has code', async () => {
        const { client, http } = mockHttp({
            account: { balance: '0x0', energy: '0x0', hasCode: true }
        });
        const detector = new ForkDetector(client);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(true);
        expect(http).toHaveBeenNthCalledWith(1, 'GET', '/blocks/best');
        expect(http).toHaveBeenNthCalledWith(
            2,
            'GET',
            `/accounts/${historyStorageAddress}`,
            { query: { revision: blockIdA } }
        );
    });

    test('false <- History Storage account has no code', async () => {
        const detector = new ForkDetector(mockHttp({}).client);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(
            false
        );
    });

    test('false <- History Storage account is missing', async () => {
        const detector = new ForkDetector(mockHttp({ account: null }).client);
        await expect(detector.isInterstellarForked()).resolves.toBe(false);
    });

    test('false <- best block is missing', async () => {
        const { client, http } = mockHttp({ block: null });
        const detector = new ForkDetector(client);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(
            false
        );
        expect(http).toHaveBeenCalledTimes(1);
        expect(http).toHaveBeenCalledWith('GET', '/blocks/best');
    });

    test('exception <- invalid revision', async () => {
        const { client, http } = mockHttp({});
        const detector = new ForkDetector(client);
        await expect(detector.isInterstellarForked('??')).rejects.toThrow(
            InvalidDataType
        );
        expect(http).not.toHaveBeenCalled();
    });

    test('true <- cached after the first positive result', async () => {
        const { client, http } = mockHttp({
            account: { balance: '0x0', energy: '0x0', hasCode: true }
        });
        const detector = new ForkDetector(client);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(true);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(true);
        expect(http).toHaveBeenCalledTimes(2);
    });

    test('false <- a new best is re-checked instead of reusing a cached best', async () => {
        const upcomingIds = [blockIdA, blockIdB];
        const { client, http } = mockHttp({
            resolveBlock: () => ({ id: upcomingIds.shift() ?? blockIdB })
        });
        const detector = new ForkDetector(client);
        await expect(detector.isInterstellarForked('best')).resolves.toBe(
            false
        );
        await expect(detector.isInterstellarForked('best')).resolves.toBe(
            false
        );
        expect(http).toHaveBeenCalledTimes(4);
        expect(http).toHaveBeenNthCalledWith(
            2,
            'GET',
            `/accounts/${historyStorageAddress}`,
            { query: { revision: blockIdA } }
        );
        expect(http).toHaveBeenNthCalledWith(
            4,
            'GET',
            `/accounts/${historyStorageAddress}`,
            { query: { revision: blockIdB } }
        );
    });

    test('true <- block ID revision skips resolving best', async () => {
        const { client, http } = mockHttp({
            account: { balance: '0x0', energy: '0x0', hasCode: true }
        });
        const detector = new ForkDetector(client);
        await expect(detector.isInterstellarForked(blockIdA)).resolves.toBe(
            true
        );
        expect(http).toHaveBeenCalledTimes(1);
        expect(http).toHaveBeenCalledWith(
            'GET',
            `/accounts/${historyStorageAddress}`,
            { query: { revision: blockIdA } }
        );
    });

    test('true <- detectInterstellar is an alias of isInterstellarForked', async () => {
        const detector = new ForkDetector(
            mockHttp({
                account: { balance: '0x0', energy: '0x0', hasCode: true }
            }).client
        );
        await expect(detector.detectInterstellar()).resolves.toBe(true);
    });
});
