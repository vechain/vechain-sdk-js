import { describe, test, jest, expect } from '@jest/globals';
import {
    type FetchHttpClient,
    type PeerStatJSON,
    RetrieveConnectedPeers
} from '../../../src';

const mockHttpClient = <T>(response: T): FetchHttpClient => {
    return {
        get: jest.fn().mockImplementation(() => {
            return {
                json: jest.fn().mockImplementation(() => {
                    return response;
                })
            };
        })
    } as unknown as FetchHttpClient;
};

/**
 *VeChain node - unit
 *
 * @group unit/node
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
        ];

        const mockPeersResponse = await new RetrieveConnectedPeers().askTo(
            mockHttpClient<PeerStatJSON[]>(mockPeers)
        );
        expect(mockPeersResponse.response.toJSON()).toEqual(mockPeers);

        const emptyPeersResponse = await new RetrieveConnectedPeers().askTo(
            mockHttpClient<PeerStatJSON[]>([])
        );
        expect(emptyPeersResponse.response.toJSON()).toEqual([]);
    });
});
