import { beforeEach, describe, expect, test } from '@jest/globals';
import { MAINNET_URL, ThorClient } from '../../../src';

import { B3TR, X2EarnRewardsPool } from '@vechain/vebetterdao-contracts';
import { FixedPointNumber, Units } from '@vechain/sdk-core';

/**
 * Mainnet - Tests for the ThorClient class, focused on event-related functionality.
 *
 * @group integration/client/thor-client/contracts/event
 */
describe('ThorClient - Mainnet allocation events', () => {
    // ThorClient instance
    let thorMainnetClient: ThorClient;

    const EVEARN_APP_ID =
        '0x6c977a18d427360e27c3fc2129a6942acd4ece2c8aaeaf4690034931dc5ba7f9';

    beforeEach(() => {
        thorMainnetClient = ThorClient.fromUrl(MAINNET_URL);
    });

    test('Should filter EVearn distribute rewards events', async () => {
        const x2EarnRewardsPoolContract = thorMainnetClient.contracts.load(
            X2EarnRewardsPool.address.mainnet,
            X2EarnRewardsPool.abi
        );

        const events = await x2EarnRewardsPoolContract.filters
            .RewardDistributed({
                appId: EVEARN_APP_ID
            })
            .get({ order: 'desc', options: { offset: 0, limit: 1000 } });

        expect(events).toBeDefined();
        expect(events.length).toBeGreaterThan(0);
    }, 30000);

    test('Should filter EVearn distribute rewards events', async () => {
        const B3TRContract = thorMainnetClient.contracts.load(
            B3TR.address.mainnet,
            B3TR.abi
        );

        const events = await B3TRContract.filters
            .Transfer({
                from: '0x190ab784b0b68deec7e831502dd65fdd1d2a8f99'
            })
            .get({ order: 'desc', options: { offset: 0, limit: 1000 } });

        let amount: bigint = 0n;

        for (const event of events) {
            if (event?.decodedData !== undefined) {
                amount += event.decodedData[2] as bigint;
            }
        }

        console.log(
            'Total B3TR transferred:',
            Units.formatEther(FixedPointNumber.of(amount))
        );
        expect(events.length).toBeGreaterThan(0);
        console.log(events[0]);
    }, 30000);
});
