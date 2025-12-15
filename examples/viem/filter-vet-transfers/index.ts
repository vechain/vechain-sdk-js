import { ThorNetworks, TransferLog } from '@vechain/sdk-temp/thor';
import { createPublicClient } from '@vechain/sdk-temp/viem';

async function example(): Promise<void> {
    // Create viem-compatible public client
    const publicClient = createPublicClient({ network: ThorNetworks.MAINNET });

    // Get current block number using publicClient
    const currentBlockNumber = await publicClient.getBlockNumber();
    const startBlock = currentBlockNumber - 8640; // ~24 hours of blocks

    let offset = 0;
    const logs: TransferLog[] = [];

    // Filter VET transfers using publicClient.getTransferLogs()
    while (true) {
        const transferLogs = await publicClient.getTransferLogs({
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
            transferLogs.forEach((transferLog) => logs.push(transferLog));
            offset += 1000;
        } else {
            break;
        }
    }
    console.log('Found', logs.length, 'VET transfers');
}

example().catch(console.error);
