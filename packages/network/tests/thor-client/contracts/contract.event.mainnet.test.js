"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const vebetterdao_contracts_1 = require("@vechain/vebetterdao-contracts");
/**
 * Mainnet - Tests for the ThorClient class, focused on event-related functionality.
 *
 * @group integration/client/thor-client/contracts/event
 */
(0, globals_1.describe)('ThorClient - Mainnet allocation events', () => {
    // ThorClient instance
    let thorMainnetClient;
    const EVEARN_APP_ID = '0x6c977a18d427360e27c3fc2129a6942acd4ece2c8aaeaf4690034931dc5ba7f9';
    (0, globals_1.beforeEach)(() => {
        thorMainnetClient = src_1.ThorClient.at(src_1.MAINNET_URL);
    });
    (0, globals_1.test)('Should filter EVearn distribute rewards events', async () => {
        const x2EarnRewardsPoolContract = thorMainnetClient.contracts.load(vebetterdao_contracts_1.X2EarnRewardsPool.address.mainnet, vebetterdao_contracts_1.X2EarnRewardsPool.abi);
        const events = await x2EarnRewardsPoolContract.filters
            .RewardDistributed({
            appId: EVEARN_APP_ID
        })
            .get({ order: 'desc', options: { offset: 0, limit: 1000 } });
        (0, globals_1.expect)(events).toBeDefined();
        (0, globals_1.expect)(events.length).toBeGreaterThan(0);
    }, 30000);
    (0, globals_1.test)('Should filter EVearn distribute rewards events', async () => {
        const B3TRContract = thorMainnetClient.contracts.load(vebetterdao_contracts_1.B3TR.address.mainnet, vebetterdao_contracts_1.B3TR.abi);
        const events = await B3TRContract.filters
            .Transfer({
            from: '0x190ab784b0b68deec7e831502dd65fdd1d2a8f99'
        })
            .get({ order: 'desc', options: { offset: 0, limit: 1000 } });
        (0, globals_1.expect)(events.length).toBeGreaterThan(0);
    }, 30000);
});
