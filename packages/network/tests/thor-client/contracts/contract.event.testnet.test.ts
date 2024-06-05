import { beforeEach, describe, test } from '@jest/globals';
import { ThorClient } from '../../../src';
import { testnetUrl } from '../../fixture';
import {
    emissionAddress,
    emissionsABI,
    xAllocationAddress,
    xAllocationVotingGovernorABI
} from './fixture';

describe('ThorClient - ERC20 Contracts', () => {
    // ThorClient instance
    let thorTestnetClient: ThorClient;

    beforeEach(() => {
        thorTestnetClient = ThorClient.fromUrl(testnetUrl);
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

        const xAllocationVotingEvents =
            await thorTestnetClient.logs.filterEventLogs({
                criteriaSet: [
                    xAllocationVotingContract.criteria.RoundCreated(),
                    emissionsContract.criteria.EmissionDistributed(),
                    xAllocationVotingContract.criteria.RoundCreated()
                ],

                range: {
                    unit: 'block',
                    from: 0,
                    to: (
                        await thorTestnetClient.blocks.getBestBlockCompressed()
                    )?.number
                },
                options: {
                    offset: 0,
                    limit: 256
                },
                order: 'asc'
            });

        console.log(xAllocationVotingEvents);
    }, 30000);
});
