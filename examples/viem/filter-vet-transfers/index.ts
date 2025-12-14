import { Revision } from '@vechain/sdk-temp/common';
import { ThorNetworks } from '@vechain/sdk-temp/thor';
import { createPublicClient } from '@vechain/sdk-temp/viem';

async function example(): Promise<void> {
    const publicClient = createPublicClient({ network: ThorNetworks.MAINNET });
    const thorLogs = (
        publicClient as unknown as { thorClient: { logs: any; blocks: any } }
    ).thorClient;

    const currentBlock = await thorLogs.blocks.getBlock(Revision.BEST);
    if (!currentBlock) {
        throw new Error('Failed to get current block');
    }
    const currentBlockNumber = currentBlock.number;
    const startBlock = currentBlockNumber - 8640;

    let offset = 0;
    const logs: any[] = [];

    while (true) {
        const transferLogs = await thorLogs.logs.filterTransferLogs({
            range: {
                unit: 'block',
                from: startBlock,
                to: currentBlockNumber
            },
            options: {
                offset,
                limit: 1000
            },
            criteriaSet: [
                {
                    recipient: '0x00000000000000000000000000005374616B6572'
                }
            ],
            order: 'asc'
        });
        if (transferLogs.length > 0) {
            transferLogs.forEach((transferLog: any) => logs.push(transferLog));
            offset += 1000;
        } else {
            break;
        }
    }
    console.log('Found', logs.length, 'VET transfers');
}

example().catch(console.error);
