import { Hex } from '@vechain/sdk-temp/common';
import { ThorNetworks } from '@vechain/sdk-temp/thor';
import { createPublicClient } from '@vechain/sdk-temp/viem';
import { encodeEventTopics, parseAbiItem } from 'viem';

async function example(): Promise<void> {
    const publicClient = createPublicClient({ network: ThorNetworks.MAINNET });

    const contractAddress = '0x0000000000000000000000000000456E65726779';

    // Define the ABI event using viem's parseAbiItem
    const abiEvent = parseAbiItem(
        'event Transfer(address indexed from, address indexed to, uint256 value)'
    );

    // Encode the filter topics using viem's encodeEventTopics
    // Filter for transfers TO a specific address (don't filter by 'from')
    const encodedTopics = encodeEventTopics({
        abi: [abiEvent],
        eventName: 'Transfer',
        args: {
            to: '0xFf0F343772Ae053f6DDB2885EA9DF1d301E222f6'
        }
    });

    // Get the current block number
    const currentBlockNumber = await publicClient.getBlockNumber();

    // Create an event filter
    // encodedTopics[0] is the event signature (topic0 - handled by the event param)
    // encodedTopics[1] is from (null when not filtered)
    // encodedTopics[2] is to (the encoded address we're filtering for)
    // Args map to: args[0] -> topic1, args[1] -> topic2, args[2] -> topic3
    const topic1 = encodedTopics[1];
    const topic2 = encodedTopics[2];
    const args: Array<Hex | undefined> = [
        topic1 != null && typeof topic1 === 'string'
            ? Hex.of(topic1)
            : undefined,
        topic2 != null && typeof topic2 === 'string'
            ? Hex.of(topic2)
            : undefined
    ];

    const eventFilter = publicClient.createEventFilter({
        address: contractAddress,
        event: abiEvent,
        args: args as Hex[],
        fromBlock: BigInt(18925068),
        toBlock: BigInt(currentBlockNumber)
    });

    // Get decoded event logs using the filter
    const decodedLogs = await publicClient.getLogs(eventFilter);

    console.log('Decoded event logs:', decodedLogs);
}

example().catch(console.error);
