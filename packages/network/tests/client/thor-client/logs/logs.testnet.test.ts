import { describe, expect, test } from '@jest/globals';
import { thorClient } from '../../../fixture';
import { type FilterEventLogsArg } from '../../../../src/client/thor/logs';

/**
 * ThorClient class tests
 *
 * @group integration/client/thor/logs
 */
describe('ThorClient - Logs', () => {
    /**
     * filterEventLogs tests
     */
    test('filterEventLogs', async () => {
        const args: FilterEventLogsArg = {
            range: {
                unit: 'block',
                from: 0,
                to: 100000
            },
            options: {
                offset: 0,
                limit: 10
            },
            criteriaSet: [
                {
                    address: '0x0000000000000000000000000000456E65726779',
                    topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    topic1: '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
                }
            ],
            order: 'asc'
        };
        const eventLogs = await thorClient.logs.filterEventLogs(args);
        expect(eventLogs).toBeDefined();
    });
});
