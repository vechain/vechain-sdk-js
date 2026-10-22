import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { HttpNetworkError, InvalidHTTPRequest } from '@vechain/sdk-errors';
import {
    type CompressedBlockDetail,
    type EventLogs,
    type FilterRawEventLogsOptions,
    ThorClient,
    VeChainProvider
} from '../../../../src';

const START_BLOCK = 100;
const BLOCK_TIME_MS = 10000;

/**
 * Returns a block stub; only `number` is read by the subscription poll.
 */
const blockStub = (n: number): CompressedBlockDetail =>
    ({ number: n }) as unknown as CompressedBlockDetail;

/**
 * VeChain provider subscription polling tests
 *
 * @group unit/providers/vechain-provider-subscriptions
 */
describe('VeChain provider subscription polling', () => {
    let thorClient: ThorClient;
    let provider: VeChainProvider;
    let scannedBlocks: number[];
    let startTime: number;

    /**
     * Simulates a chain whose head advances by one block every BLOCK_TIME_MS.
     */
    const head = (): number =>
        START_BLOCK + Math.floor((Date.now() - startTime) / BLOCK_TIME_MS);

    const mockChain = (blockLatencyMs: number): void => {
        jest.spyOn(
            thorClient.blocks,
            'getBestBlockCompressed'
        ).mockImplementation(
            async () => await Promise.resolve(blockStub(head()))
        );
        jest.spyOn(thorClient.blocks, 'getBlockCompressed').mockImplementation(
            async (revision) =>
                await new Promise((resolve) => {
                    setTimeout(() => {
                        const n = Number(revision);
                        resolve(n <= head() ? blockStub(n) : null);
                    }, blockLatencyMs);
                })
        );
    };

    const subscribeToLogs = async (): Promise<void> => {
        await provider.request({
            method: 'eth_subscribe',
            params: [
                'logs',
                {
                    address: ['0x0000000000000000000000000000456e65726779'],
                    topics: []
                }
            ]
        });
    };

    beforeEach(() => {
        jest.useFakeTimers();
        startTime = Date.now();
        scannedBlocks = [];
        thorClient = ThorClient.at('http://localhost:8669');
        provider = new VeChainProvider(thorClient);
    });

    afterEach(() => {
        provider.destroy();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('Should scan every block exactly once when the node responds slower than the polling interval', async () => {
        mockChain(7000);
        // Blocks whose logs were queried before the block was produced.
        const scannedAhead: number[] = [];
        jest.spyOn(thorClient.logs, 'filterRawEventLogs').mockImplementation(
            async (options: FilterRawEventLogsOptions) => {
                const from = options.range?.from as number;
                scannedBlocks.push(from);
                if (from > head()) scannedAhead.push(from);
                return await Promise.resolve([] as EventLogs[]);
            }
        );

        await subscribeToLogs();
        await jest.advanceTimersByTimeAsync(120000);

        const expected = Array.from(
            { length: scannedBlocks.length },
            (_, i) => START_BLOCK + i
        );
        expect(scannedBlocks.length).toBeGreaterThan(0);
        expect(scannedBlocks).toEqual(expected);
        expect(scannedAhead).toEqual([]);
    });

    const request = {
        method: 'POST',
        url: 'http://localhost:8669/logs/event'
    };

    const httpStatusError = (status: number): InvalidHTTPRequest =>
        new InvalidHTTPRequest(
            'HttpClient.http()',
            `HTTP ${status}`,
            request,
            new Error(`HTTP ${status}`, { cause: { status } })
        );

    const abortError = new Error('This operation was aborted');
    abortError.name = 'AbortError';

    /**
     * Fails the first logs request with the given error, then succeeds.
     */
    const failFirstLogsRequest = (error: Error): void => {
        let calls = 0;
        jest.spyOn(thorClient.logs, 'filterRawEventLogs').mockImplementation(
            async (options: FilterRawEventLogsOptions) => {
                calls++;
                if (calls === 1) {
                    throw error;
                }
                scannedBlocks.push(options.range?.from as number);
                return await Promise.resolve([] as EventLogs[]);
            }
        );
    };

    test.each([
        {
            name: 'a network error',
            error: new HttpNetworkError('HttpClient.http()', 'fetch failed', {
                ...request,
                networkErrorType: 'TypeError'
            })
        },
        {
            name: 'a request timeout',
            error: new InvalidHTTPRequest(
                'HttpClient.http()',
                abortError.message,
                request,
                abortError
            )
        },
        { name: 'an HTTP 429 response', error: httpStatusError(429) },
        { name: 'an HTTP 503 response', error: httpStatusError(503) }
    ])(
        'Should keep polling and retry the same block after $name while fetching logs',
        async ({ error }) => {
            mockChain(0);
            failFirstLogsRequest(error);

            await subscribeToLogs();
            await jest.advanceTimersByTimeAsync(60000);

            expect(provider.getPollInstance()).toBeDefined();
            expect(scannedBlocks[0]).toBe(START_BLOCK);
        }
    );

    test('Should stop polling after a non-transient error while fetching logs', async () => {
        mockChain(0);
        failFirstLogsRequest(httpStatusError(400));

        await subscribeToLogs();
        await jest.advanceTimersByTimeAsync(60000);

        expect(provider.getPollInstance()).toBeUndefined();
        expect(scannedBlocks).toEqual([]);
    });
});
