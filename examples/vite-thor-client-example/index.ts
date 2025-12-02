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
 * EXAMPLE:
 * - get current block
 * - get block details
 * - display information
 */
async function getBlockInfo() {
    try {
        const block = await client.blocks.getBlock(Revision.BEST);
        
        if (block === null) {
            log.error({ message: 'Failed to get current block' });
            return [
                '<h2>❌ Error</h2>',
                '<p>Failed to get current block from the network.</p>'
            ];
        }
        
        log.info({ message: `Current block: ${block.number}` });
        
        // Get additional block details
        const blockDetails = await client.blocks.getBlock(block.id);
        
        return [
            '<h2>✅ VeChain Thor Client Example</h2>',
            '<div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-top: 16px;">',
            `<p><strong>Network:</strong> ${ThorNetworks.TESTNET}</p>`,
            `<p><strong>Current Block Number:</strong> ${block.number.toString()}</p>`,
            `<p><strong>Block ID:</strong> <code style="font-size: 0.9em;">${block.id.toString()}</code></p>`,
            blockDetails ? `<p><strong>Block Size:</strong> ${blockDetails.size.toString()} bytes</p>` : '',
            blockDetails ? `<p><strong>Transactions:</strong> ${blockDetails.transactions.length}</p>` : '',
            '</div>',
            '<p style="margin-top: 16px; color: #666;">This example demonstrates connecting to VeChain Thor testnet using the SDK.</p>'
        ];
    } catch (error) {
        log.error({ message: 'Error fetching block', error });
        return [
            '<h2>❌ Error</h2>',
            `<p style="color: red;">${error instanceof Error ? error.message : 'Unknown error occurred'}</p>`
        ];
    }
}

export default getBlockInfo();
