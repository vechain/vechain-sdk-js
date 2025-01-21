import { describe, test } from '@jest/globals';
import {
    type FetchHttpClient,
    type PeerStatJSON,
    RetrieveConnectedPeers
} from '../../../src';

/**
 *VeChain node - unit
 *
 * @group unit/node
 */
describe('RetrieveConnectedPeers unit tests', () => {
    test('ok <- askTo', async () => {
        const mockHttpClient = {
            get: jest.fn().mockImplementation(() => {
                return {
                    json: jest.fn().mockImplementation(() => {
                        return [
                            {
                                name: 'thor/v1.0.0-6680b98-dev/linux/go1.10.3',
                                bestBlockID:
                                    '0x000087b3a4d4cdf1cc52d56b9704f4c18f020e1b48dbbf4a23d1ee4f1fa5ff94',
                                totalScore: 68497,
                                peerID: '50e122a505ee55b84331068acfd857e37ad58f463a0fab9aaff2c1e4b2e2d22ae71dc14fdaf6eead74bd3f60594644aa35c588f9ca6be3341e2ce18ddc413321',
                                netAddr: '128.1.39.120:11235',
                                inbound: false,
                                duration: 28
                            }
                        ] as PeerStatJSON[];
                    })
                };
            })
        } as unknown as FetchHttpClient;

        const r = await new RetrieveConnectedPeers().askTo(mockHttpClient);
        console.log(r.response.toJSON());
    });
});
