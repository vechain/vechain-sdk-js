import { FetchHttpClient } from '@common/http';
import { describe, expect, jest, test } from '@jest/globals';
import { ThorNetworks } from '@thor/thorest/utils';

/**
 * @group unit
 */
describe('SocketErrorRetry', () => {
    describe('GET', () => {
        test('if retry enabled, should retry GET request on socket error', async () => {
            // create a http client where we override the fetch function to always throw a socket error
            // set the number of retries to 5
            const failingSocketFetch = jest
                .fn<typeof fetch>()
                .mockRejectedValue(
                    Object.assign(new Error('socket hang up'), {
                        name: 'SocketError',
                        code: 'ECONNRESET',
                        errno: 'ECONNRESET',
                        cause: { code: 'ECONNRESET', name: 'SocketError' }
                    })
                );
            const httpClient = FetchHttpClient.at(
                new URL(ThorNetworks.SOLONET),
                {
                    retrySocketError: true,
                    retrySockerErrorCount: 5
                },
                Request,
                failingSocketFetch
            );
            await expect(httpClient.get()).rejects.toThrow(
                'Http Socket error detected after retries'
            );
            expect(failingSocketFetch).toHaveBeenCalledTimes(5);
        });
        test('if retry disabled, should not retry GET request on socket error', async () => {
            // create a http client where we override the fetch function to always throw a socket error
            const failingSocketFetch = jest
                .fn<typeof fetch>()
                .mockRejectedValue(
                    Object.assign(new Error('socket hang up'), {
                        name: 'SocketError',
                        code: 'ECONNRESET',
                        errno: 'ECONNRESET',
                        cause: { code: 'ECONNRESET', name: 'SocketError' }
                    })
                );
            const httpClient = FetchHttpClient.at(
                new URL(ThorNetworks.SOLONET),
                {
                    retrySocketError: false
                },
                Request,
                failingSocketFetch
            );
            await expect(httpClient.get()).rejects.toThrow('socket hang up');
            expect(failingSocketFetch).toHaveBeenCalledTimes(1);
        });
        test('if retry not specified, should use default retry settings', async () => {
            // create a http client where we override the fetch function to always throw a socket error
            const failingSocketFetch = jest
                .fn<typeof fetch>()
                .mockRejectedValue(
                    Object.assign(new Error('socket hang up'), {
                        name: 'SocketError',
                        code: 'ECONNRESET',
                        errno: 'ECONNRESET',
                        cause: { code: 'ECONNRESET', name: 'SocketError' }
                    })
                );
            const httpClient = FetchHttpClient.at(
                new URL(ThorNetworks.SOLONET),
                {},
                Request,
                failingSocketFetch
            );
            await expect(httpClient.get()).rejects.toThrow(
                'Http Socket error detected after retries'
            );
            expect(failingSocketFetch).toHaveBeenCalledTimes(3);
        });
    });
    describe('POST', () => {
        test('if retry enabled, should retry POST request on socket error', async () => {
            // create a http client where we override the fetch function to always throw a socket error
            // set the number of retries to 5
            const failingSocketFetch = jest
                .fn<typeof fetch>()
                .mockRejectedValue(
                    Object.assign(new Error('socket hang up'), {
                        name: 'SocketError',
                        code: 'ECONNRESET',
                        errno: 'ECONNRESET',
                        cause: { code: 'ECONNRESET', name: 'SocketError' }
                    })
                );
            const httpClient = FetchHttpClient.at(
                new URL(ThorNetworks.SOLONET),
                {
                    retrySocketError: true,
                    retrySockerErrorCount: 5
                },
                Request,
                failingSocketFetch
            );
            await expect(httpClient.post()).rejects.toThrow(
                'Http Socket error detected after retries'
            );
            expect(failingSocketFetch).toHaveBeenCalledTimes(5);
        });
        test('if retry disabled, should not retry POST request on socket error', async () => {
            // create a http client where we override the fetch function to always throw a socket error
            const failingSocketFetch = jest
                .fn<typeof fetch>()
                .mockRejectedValue(
                    Object.assign(new Error('socket hang up'), {
                        name: 'SocketError',
                        code: 'ECONNRESET',
                        errno: 'ECONNRESET',
                        cause: { code: 'ECONNRESET', name: 'SocketError' }
                    })
                );
            const httpClient = FetchHttpClient.at(
                new URL(ThorNetworks.SOLONET),
                {
                    retrySocketError: false
                },
                Request,
                failingSocketFetch
            );
            await expect(httpClient.post()).rejects.toThrow('socket hang up');
            expect(failingSocketFetch).toHaveBeenCalledTimes(1);
        });
        test('if retry not specified, should use default retry settings', async () => {
            // create a http client where we override the fetch function to always throw a socket error
            const failingSocketFetch = jest
                .fn<typeof fetch>()
                .mockRejectedValue(
                    Object.assign(new Error('socket hang up'), {
                        name: 'SocketError',
                        code: 'ECONNRESET',
                        errno: 'ECONNRESET',
                        cause: { code: 'ECONNRESET', name: 'SocketError' }
                    })
                );
            const httpClient = FetchHttpClient.at(
                new URL(ThorNetworks.SOLONET),
                {},
                Request,
                failingSocketFetch
            );
            await expect(httpClient.post()).rejects.toThrow(
                'Http Socket error detected after retries'
            );
            expect(failingSocketFetch).toHaveBeenCalledTimes(3);
        });
    });
});
