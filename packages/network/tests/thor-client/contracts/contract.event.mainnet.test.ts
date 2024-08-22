import { beforeEach, describe, expect, test } from '@jest/globals';
import { MAINNET_URL, ThorClient } from '../../../src';

import { X2EarnRewardsPool } from '@vechain/vebetterdao-contracts';

describe('ThorClient - ERC20 Contracts', () => {
    // ThorClient instance
    let thorMainnetClient: ThorClient;

    const EVEARN_APP_ID =
        '0x6c977a18d427360e27c3fc2129a6942acd4ece2c8aaeaf4690034931dc5ba7f9';

    beforeEach(() => {
        thorMainnetClient = ThorClient.fromUrl(MAINNET_URL);
    });

    test('Should filter EVearn distribute rewards events', async () => {
        const x2EarnRewardsPoolContract = thorMainnetClient.contracts.load(
            X2EarnRewardsPool.address,
            X2EarnRewardsPool.abi
        );

        const events = await x2EarnRewardsPoolContract.filters
            .RewardDistributed({
                appId: EVEARN_APP_ID
            })
            .get({ order: 'desc' });

        expect(events).toBeDefined();
        expect(events.length).toBeGreaterThan(0);
    }, 30000);
});
