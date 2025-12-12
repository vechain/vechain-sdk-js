import { Hex, Revision } from '@vechain/sdk-temp/common';
import { ABIEvent, DecodedEventLog, EventLog } from '@vechain/sdk-temp/thor';
import { ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor';


async function example(): Promise<void> {

    // create a client of the blockchain
    const thorClient = ThorClient.at(ThorNetworks.MAINNET);

    // declare the deployed contract instance you wish to get the events and logs from
    // this is the VTHO contract address
    const contractAddress = '0x0000000000000000000000000000456E65726779';

    // create the definition of the ABI event to filter for
    // here we are filtering for the Transfer event
    const abiEventSignature = 'event Transfer(address indexed from, address indexed to, uint256 value)';
    const abiEvent = new ABIEvent(abiEventSignature);

    // encode the filter topics for the event
    const encodedTopics = abiEvent.encodeFilterTopics([
        // first topic indexed value is "from", set to null to not use it
        null,
        // second indexed value is "to"
        '0xFf0F343772Ae053f6DDB2885EA9DF1d301E222f6',
    ]);
    console.log('Encoded topics:', encodedTopics);

    // get the current block number
    const currentBlock = await thorClient.blocks.getBlock(Revision.BEST);
    if (!currentBlock) {
        throw new Error('Failed to get current block');
    }
    const currentBlockNumber = currentBlock.number;



    // Start filtering the VTHO Transfer events
    // Note: thor only returns a maximum of 1000 events at a time, so we need to paginate
    let offset = 0;
    const decodedLogs: DecodedEventLog[] = [];
    while (true) {
        const eventLogs = await thorClient.logs.filterRawEventLogs({
            // Specify the range of blocks to search for events
            // here we are searching for events from the beginning of the blockchain
            range: {
                unit: 'block',
                from: 18925068,
                to: currentBlockNumber,
            },
            // Additional options for the query, such as offset and limit for pagination
            options: {
                offset,
                limit: 1000,
            },
            // Define criteria for filtering events
            criteriaSet: [
            {
                address: contractAddress,
                topic0: Hex.of(encodedTopics[0] as string),
                topic2: Hex.of(encodedTopics[2] as string),
            },
            ],
            // Specify the order in which logs should be retrieved (ascending in this case)
            order: 'asc',
        });
        if (eventLogs.length > 0) {
            eventLogs.forEach((log) => {
                const decodedEvent = abiEvent.decodeEventLog({ data: log.data.toString(), topics: log.topics.map(topic => topic.toString()) });
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

// run the example
example().catch(console.error);