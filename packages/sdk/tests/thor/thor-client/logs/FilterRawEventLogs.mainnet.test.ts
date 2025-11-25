import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';
import { type EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';

/**
 * @group mainnet
 */
describe('FilterRawEventLogs mainnet tests', () => {
    test('should get raw event logs - vebetterdao sustainable actions', async () => {
        const thorClient = ThorClient.at(ThorNetworks.MAINNET);
        const eventFilter: EventLogFilter = {
            range: {
                unit: 'block',
                from: 23345000,
                to: 23345267
            },
            options: {
                offset: 0,
                limit: 5,
                includeIndexes: true
            },
            criteriaSet: [
                {
                    address: '0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631'
                }
            ],
            order: 'asc'
        };

        const eventLogs = await thorClient.logs.filterRawEventLogs(eventFilter);
        expect(eventLogs).toBeDefined();
        expect(eventLogs.length).toBe(5);
        expect(eventLogs[0].address.toString().toLowerCase()).toBe(
            '0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631'.toLowerCase()
        );
        expect(eventLogs[0].topics.length).toBe(4);
        expect(eventLogs[0].topics[0].toString().toLowerCase()).toBe(
            '0x4811710b0c25cc7e05baf214b3a939cf893f1cbff4d0b219e680f069a4f204a2'.toLowerCase()
        );
        expect(eventLogs[0].topics[1].toString().toLowerCase()).toBe(
            '0x2fc30c2ad41a2994061efaf218f1d52dc92bc4a31a0f02a4916490076a7a393a'.toLowerCase()
        );
        expect(eventLogs[0].topics[2].toString().toLowerCase()).toBe(
            '0x00000000000000000000000071c67ab313242173b731a2ed064062391688c6bc'.toLowerCase()
        );
        expect(eventLogs[0].topics[3].toString().toLowerCase()).toBe(
            '0x000000000000000000000000b6f43457600b1f3b7b98fc4394a9f1134ffc721d'.toLowerCase()
        );
        expect(eventLogs[0].data.toString().length).toBeGreaterThan(0);
        expect(eventLogs[0].meta.blockID.toString().toLowerCase()).toBe(
            '0x01643768b5c18156c894fb1a07ef6db0ee0311fae86855a1669e2de18802894d'.toLowerCase()
        );
        expect(eventLogs[0].meta.blockNumber).toBe(23345000);
        expect(eventLogs[0].meta.blockTimestamp).toBe(1763980690);
        expect(eventLogs[0].meta.txID.toString().toLowerCase()).toBe(
            '0x91fadb942fab50d27bccf2f1aa0f9ec4dc28fb6ed6e5729e871e324941f9f084'.toLowerCase()
        );
        expect(eventLogs[0].meta.txOrigin.toString().toLowerCase()).toBe(
            '0xbfe2122a82c0aea091514f57c7713c3118101eda'.toLowerCase()
        );
        expect(eventLogs[0].meta.clauseIndex).toBe(0);
        expect(eventLogs[0].meta.txIndex).toBe(3);
        expect(eventLogs[0].meta.logIndex).toBe(2);
    });
});
