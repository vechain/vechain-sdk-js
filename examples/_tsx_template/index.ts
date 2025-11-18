import {
    LoggerRegistry,
    Revision,
    log,
    PrettyLogger
} from '@vechain/sdk-temp/common';
import { ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor';

/**
 * SETUP:
 * - create a testnet client
 * - setup console logger
 */
const client = ThorClient.at(ThorNetworks.TESTNET);
LoggerRegistry.getInstance().registerLogger(new PrettyLogger());

/**
 * EXAMPLE 1:
 * - get current block
 * - log block number
 */
const block = await client.blocks.getBlock(Revision.BEST);
if (block === null) {
    log.error({ message: 'Failed to get current block' });
} else {
    log.info({ message: `Current block: ${block.number}` });
}
