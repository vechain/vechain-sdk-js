import { describe, test, expect } from '@jest/globals';
import { ThorClient } from '../../src/client/thor/thor-client';
import { network } from './fixture';
import { type Block } from '../../src/client/thor/types';

/**
 * Integration tests for ThorClient.
 *
 * @group integration/thorclient
 */
describe('ThorClient', () => {
    test('Should retrieve account information successfully', async () => {
        const genesis: Block = (await network.http(
            'GET',
            '/blocks/0'
        )) as Block;
        const thorclient = new ThorClient(network, genesis);
        expect(thorclient).toBeDefined();
    });
});
