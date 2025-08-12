import { describe, expect, jest, test } from '@jest/globals';
import {
    type GetPeersResponse,
    type PeerStatJSON,
    RetrieveConnectedPeers
} from '@thor';
import type { HttpClient } from '@http';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const mockHttpClient = <T>(response: T): HttpClient => {
    return {
        get: jest.fn().mockReturnValue(response)
    } as unknown as HttpClient;
};

const mockResponse = <T>(body: T, status: number): Response => {
    const init: ResponseInit = {
        status,
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    };
    return new Response(fastJsonStableStringify(body), init);
};

/**
 * @group unit/thor/node
 */
describe('RetrieveConnectedPeers unit tests', () => {
    test('ok <- askTo', async () => {
        const mockPeers = [
            {
                name: 'thor/v2.0.0-6680b98-dev/linux/go1.10.3',
                bestBlockID:
                    '0x000087b3a4d4cdf1cc52d56b9704f4c18f020e1b48dbbf4a23d1ee4f1fa5ff94',
                totalScore: 68497,
                peerID: '0x50e122a505ee55b84331068acfd857e37ad58f463a0fab9aaff2c1e4b2e2d22ae71dc14fdaf6eead74bd3f60594644aa35c588f9ca6be3341e2ce18ddc413321',
                netAddr: '128.1.39.120:11235',
                inbound: false,
                duration: 28
            },
            {
                name: 'thor/v2.0.0-6680b98-dev/linux/go1.10.3',
                bestBlockID:
                    '0x000087b3a4d4cdf1cc52d56b9704f4c18f020e1b48dbbf4a23d1ee4f1fa5ff91',
                totalScore: 68496,
                peerID: '0x40e122a505ee55b84331068acfd857e37ad58f463a0fab9aaff2c1e4b2e2d22ae71dc14fdaf6eead74bd3f60594644aa35c588f9ca6be3341e2ce18ddc413321',
                netAddr: '127.1.39.120:11235',
                inbound: true,
                duration: 37
            }
        ] satisfies PeerStatJSON[];

        const mockPeersResponse = await RetrieveConnectedPeers.of().askTo(
            mockHttpClient(mockResponse(mockPeers, 200))
        );
        expect(mockPeersResponse.response).not.toBeNull();
        expect(
            (mockPeersResponse.response as GetPeersResponse).toJSON()
        ).toEqual(mockPeers);

        const emptyPeersResponse = await RetrieveConnectedPeers.of().askTo(
            mockHttpClient(mockResponse([], 200))
        );
        expect(emptyPeersResponse.response).not.toBeNull();
        expect(
            (emptyPeersResponse.response as GetPeersResponse).toJSON()
        ).toEqual([]);
    });
});
