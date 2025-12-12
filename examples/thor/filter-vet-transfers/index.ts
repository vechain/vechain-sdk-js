import { Revision } from '@vechain/sdk-temp/common';
import { ThorClient, ThorNetworks, TransferLog } from '@vechain/sdk-temp/thor';


async function example(): Promise<void> {

    // Create mainnet thor client
    const thorClient = ThorClient.at(ThorNetworks.MAINNET);

    // get the current block number
    const currentBlock = await thorClient.blocks.getBlock(Revision.BEST);
    if (!currentBlock) {
        throw new Error('Failed to get current block');
    }
    const currentBlockNumber = currentBlock.number;
    // get the starting block number for filtering from
    const startBlock = currentBlockNumber - 8640; // 8640 blocks is 1 day


    // Start filtering all VET transfer events within the specified block range
    // Note: thor only returns a maximum of 1000 events at a time, so we need to paginate
    let offset = 0;
    const logs: TransferLog[] = [];

    // loop until we have no more logs
    while (true) {
        // filter VET transfers
        const transferLogs = await thorClient.logs.filterTransferLogs({
            // Specify the range of blocks to search for events
            range: {
                unit: 'block',
                from: startBlock,
                to: currentBlockNumber,
            },
            // Additional options for the query, such as pagination offset and limit
            options: {
                offset,
                limit: 1000,
            },
            criteriaSet: [
                {
                    // Filter the VET transfers to the recipient address
                    // This is the stargate stacker contract address
                    recipient: '0x00000000000000000000000000005374616B6572',
                }
            ],
            order: 'asc',
        });
        if (transferLogs.length > 0) {
            transferLogs.forEach((transferLog) => logs.push(transferLog));
            offset += 1000;
        } else {
            break;
        }
    }
    console.log('Found', logs.length, 'VET transfers');

}

// run the example
example().catch(console.error);