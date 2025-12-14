import { Hex, Revision } from '@vechain/sdk-temp/common';
import {
    ABIEvent,
    DecodedEventLog,
    ThorNetworks
} from '@vechain/sdk-temp/thor';
import { createPublicClient } from '@vechain/sdk-temp/viem';

async function example(): Promise<void> {
    const publicClient = createPublicClient({ network: ThorNetworks.MAINNET });
    const thorClient = (publicClient as unknown as { thorClient: any })
        .thorClient;

    const contractAddress = '0x0000000000000000000000000000456E65726779';

    const abiEventSignature =
        'event Transfer(address indexed from, address indexed to, uint256 value)';
    const abiEvent = new ABIEvent(abiEventSignature);

    const encodedTopics = abiEvent.encodeFilterTopics([
        null,
        '0xFf0F343772Ae053f6DDB2885EA9DF1d301E222f6'
    ]);

    const currentBlock = await thorClient.blocks.getBlock(Revision.BEST);
    if (!currentBlock) {
        throw new Error('Failed to get current block');
    }
    const currentBlockNumber = currentBlock.number;

    let offset = 0;
    const decodedLogs: DecodedEventLog[] = [];
    while (true) {
        const eventLogs = await thorClient.logs.filterRawEventLogs({
            range: {
                unit: 'block',
                from: 18925068,
                to: currentBlockNumber
            },
            options: {
                offset,
                limit: 1000
            },
            criteriaSet: [
                {
                    address: contractAddress,
                    topic0: Hex.of(encodedTopics[0] as string),
                    topic2: Hex.of(encodedTopics[2] as string)
                }
            ],
            order: 'asc'
        });
        if (eventLogs.length > 0) {
            eventLogs.forEach((log) => {
                const decodedEvent = abiEvent.decodeEventLog({
                    data: log.data.toString(),
                    topics: log.topics.map((topic) => topic.toString())
                });
                const decodedEventLog = DecodedEventLog.of(log, decodedEvent);
                decodedLogs.push(decodedEventLog);
            });
            offset += 1000;
        } else {
            break;
        }
    }
    console.log('Decoded event logs:', decodedLogs);
}

example().catch(console.error);
