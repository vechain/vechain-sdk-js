import {
    LoggerRegistry,
    Revision,
    log,
    PrettyLogger
} from '@vechain/sdk-temp/common';
import { ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor';
import { FetchHttpClient } from '@vechain/sdk-temp/common';

/**
 * SETUP:
 * - create a testnet client with explicit window.fetch binding for browser
 * - setup console logger
 */
// Use window.fetch explicitly to avoid "Illegal invocation" error in browser
const httpClient = new FetchHttpClient(
    new URL(ThorNetworks.TESTNET),
    {},
    Request,
    typeof window !== 'undefined' ? window.fetch.bind(window) : fetch
);
const client = ThorClient.fromHttpClient(httpClient);
LoggerRegistry.getInstance().registerLogger(new PrettyLogger());

/**
 * EXAMPLE 1:
 * - get current block
 * - log block number
 */
async function getBlockInfo() {
    const block = await client.blocks.getBlock(Revision.BEST);
    if (block === null) {
        log.error({ message: 'Failed to get current block' });
        return ['Failed to get current block'];
    } else {
        log.info({ message: `Current block: ${block.number}` });
        return [`Block number: ${block.number.toString()}`];
    }
}

export default getBlockInfo();
