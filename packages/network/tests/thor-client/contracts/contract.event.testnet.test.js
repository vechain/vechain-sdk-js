"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
/**
 * Testnet - Tests for the ThorClient class, focused on event-related functionality.
 *
 * @group integration/client/thor-client/contracts/event
 */
(0, globals_1.describe)('ThorClient - Testnet allocation events', () => {
    // ThorClient instance
    let thorTestnetClient;
    (0, globals_1.beforeEach)(() => {
        thorTestnetClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    (0, globals_1.test)('Should filter x allocation events', async () => {
        const xAllocationVotingContract = thorTestnetClient.contracts.load(fixture_1.xAllocationAddress, fixture_1.xAllocationVotingGovernorABI);
        const emissionsContract = thorTestnetClient.contracts.load(fixture_1.emissionAddress, fixture_1.emissionsABI);
        const roundCreatedCriteria = xAllocationVotingContract.criteria.RoundCreated();
        const emissionDistributedCriteria = emissionsContract.criteria.EmissionDistributed();
        const xAllocationVotingEvents = await thorTestnetClient.logs.filterEventLogs({
            criteriaSet: [
                roundCreatedCriteria,
                emissionDistributedCriteria
            ],
            // We limit the range to avoid timeout
            range: {
                unit: 'block',
                from: 17000000
            },
            options: {
                offset: 0,
                limit: 256
            },
            order: 'asc'
        });
        (0, globals_1.expect)(xAllocationVotingEvents).toBeDefined();
        (0, globals_1.expect)(Array.from(xAllocationVotingEvents.keys()).length).toEqual(30);
        (0, globals_1.expect)(xAllocationVotingEvents.length).toBeGreaterThan(0);
    }, 30000);
    (0, globals_1.test)('Should filter x allocation events grouping them by type', async () => {
        const xAllocationVotingContract = thorTestnetClient.contracts.load(fixture_1.xAllocationAddress, fixture_1.xAllocationVotingGovernorABI);
        const emissionsContract = thorTestnetClient.contracts.load(fixture_1.emissionAddress, fixture_1.emissionsABI);
        const roundCreatedCriteria = xAllocationVotingContract.criteria.RoundCreated();
        const emissionDistributedCriteria = emissionsContract.criteria.EmissionDistributed();
        const xAllocationVotingEvents = await thorTestnetClient.logs.filterGroupedEventLogs({
            criteriaSet: [
                roundCreatedCriteria,
                emissionDistributedCriteria
            ],
            // We limit the range to avoid timeout
            range: {
                unit: 'block',
                from: 17000000
            },
            options: {
                offset: 0,
                limit: 256
            },
            order: 'asc'
        });
        (0, globals_1.expect)(xAllocationVotingEvents).toBeDefined();
        (0, globals_1.expect)(Array.from(xAllocationVotingEvents.keys()).length).toEqual(2);
        (0, globals_1.expect)(xAllocationVotingEvents[0].length).toBeGreaterThan(0);
        (0, globals_1.expect)(xAllocationVotingEvents[1].length).toBeGreaterThan(0);
    }, 30000);
});
