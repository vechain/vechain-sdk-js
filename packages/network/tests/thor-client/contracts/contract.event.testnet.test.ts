import { beforeEach, describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';
import {
    emissionAddress,
    emissionsABI,
    xAllocationAddress,
    xAllocationVotingGovernorABI
} from './fixture';

/**
 * Testnet - Tests for the ThorClient class, focused on event-related functionality.
 *
 * @group integration/client/thor-client/contracts/event
 */
describe('ThorClient - Testnet allocation events', () => {
    // ThorClient instance
    let thorTestnetClient: ThorClient;

    beforeEach(() => {
        thorTestnetClient = ThorClient.at(TESTNET_URL);
    });

    test('Should filter x allocation events', async () => {
        const xAllocationVotingContract = thorTestnetClient.contracts.load(
            xAllocationAddress,
            xAllocationVotingGovernorABI
        );

        const emissionsContract = thorTestnetClient.contracts.load(
            emissionAddress,
            emissionsABI
        );

        const roundCreatedCriteria =
            xAllocationVotingContract.criteria.RoundCreated();
        const emissionDistributedCriteria =
            emissionsContract.criteria.EmissionDistributed();

        const xAllocationVotingEvents =
            await thorTestnetClient.logs.filterEventLogs({
                criteriaSet: [
                    roundCreatedCriteria,
                    emissionDistributedCriteria
                ],
                options: {
                    offset: 0,
                    limit: 256
                },
                order: 'asc'
            });

        expect(xAllocationVotingEvents).toBeDefined();
        expect(Array.from(xAllocationVotingEvents.keys()).length).toEqual(30);
        expect(xAllocationVotingEvents.length).toBeGreaterThan(0);
    }, 30000);

    test('Should filter x allocation events grouping them by type', async () => {
        const xAllocationVotingContract = thorTestnetClient.contracts.load(
            xAllocationAddress,
            xAllocationVotingGovernorABI
        );

        const emissionsContract = thorTestnetClient.contracts.load(
            emissionAddress,
            emissionsABI
        );

        const roundCreatedCriteria =
            xAllocationVotingContract.criteria.RoundCreated();
        const emissionDistributedCriteria =
            emissionsContract.criteria.EmissionDistributed();

        const xAllocationVotingEvents =
            await thorTestnetClient.logs.filterGroupedEventLogs({
                criteriaSet: [
                    roundCreatedCriteria,
                    emissionDistributedCriteria
                ],
                options: {
                    offset: 0,
                    limit: 256
                },
                order: 'asc'
            });

        expect(xAllocationVotingEvents).toBeDefined();
        expect(Array.from(xAllocationVotingEvents.keys()).length).toEqual(2);
        expect(xAllocationVotingEvents[0].length).toBeGreaterThan(0);
        expect(xAllocationVotingEvents[1].length).toBeGreaterThan(0);
    }, 30000);
});
