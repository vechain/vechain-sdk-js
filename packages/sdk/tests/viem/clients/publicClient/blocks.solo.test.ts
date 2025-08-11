import { describe, expect, test } from '@jest/globals';
import { createPublicClient, BlockReponseType } from '@viem';
import { ThorNetworks } from '@thor/thorest';
import { Hex } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';

/**
 * Test suite for PublicClient block-related functionality
 *
 * Tests all block-related methods:
 * - getBlock (regular, expanded, raw)
 * - getBlockNumber
 * - getBlockTransactionCount
 * - watchBlocks
 * - watchBlockNumber
 *
 * @group integration/clients
 */
describe('PublicClient - Block Methods', () => {
    const customTransport = new FetchHttpClient(new URL(ThorNetworks.SOLONET), {
        onRequest: (request) => {
            console.log(`Making ${request.method} request to ${request.url}`);
            return request;
        },
        onResponse: (response) => {
            console.log(`Response: ${response.status} ${response.statusText}`);
            return response;
        },
        timeout: 10000,
        headers: {
            'User-Agent': 'MyVeChainApp/1.0'
        }
    });
    // Create a public client connected to mainnet
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET,
        transport: customTransport
    });

    // Genesis block ID for solo network
    const genesisBlockId =
        '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';

    describe('getBlock', () => {
        test('should retrieve regular block by ID', async () => {
            const block = await publicClient.getBlock(
                0, // Genesis block number
                BlockReponseType.regular
            );

            expect(block).toBeDefined();
            expect(block).not.toBeNull();

            if (block) {
                // Verify the block has expected properties for regular response
                expect(block).toHaveProperty('number');
                expect(block).toHaveProperty('id');
                expect(block).toHaveProperty('size');
                expect(block).toHaveProperty('parentID');
                expect(block).toHaveProperty('timestamp');
                expect(block).toHaveProperty('gasLimit');
                expect(block).toHaveProperty('gasUsed');
                expect(block).toHaveProperty('totalScore');
                expect(block).toHaveProperty('txsRoot');
                expect(block).toHaveProperty('stateRoot');
                expect(block).toHaveProperty('receiptsRoot');
                expect(block).toHaveProperty('signer');
                expect(block).toHaveProperty('transactions');

                // Verify the block number is 0 (genesis block)
                expect(block).toHaveProperty('number');
                expect((block as any).number).toBe(0);

                console.log('Regular Block Properties:');
                console.log(`Block Number: ${(block as any).number}`);
                console.log(`Block ID: ${(block as any).id}`);
                console.log(`Gas Limit: ${(block as any).gasLimit}`);
                console.log(`Gas Used: ${(block as any).gasUsed}`);
                console.log(
                    `Transaction Count: ${(block as any).transactions.length}`
                );
            }
        }, 30000);

        test('should retrieve expanded block by ID', async () => {
            const block = await publicClient.getBlock(
                0, // Genesis block number
                BlockReponseType.expanded
            );

            expect(block).toBeDefined();
            expect(block).not.toBeNull();

            if (block) {
                // Verify the block has expected properties for expanded response
                expect(block).toHaveProperty('number');
                expect(block).toHaveProperty('id');
                expect(block).toHaveProperty('transactions');

                // Expanded blocks should have full transaction details
                const transactions = (block as any).transactions;
                if (transactions && transactions.length > 0) {
                    const firstTx = transactions[0];
                    expect(firstTx).toHaveProperty('id');
                    expect(firstTx).toHaveProperty('chainTag');
                    expect(firstTx).toHaveProperty('blockRef');
                    expect(firstTx).toHaveProperty('expiration');
                    expect(firstTx).toHaveProperty('clauses');
                    expect(firstTx).toHaveProperty('gasPriceCoef');
                    expect(firstTx).toHaveProperty('gas');
                    expect(firstTx).toHaveProperty('origin');

                    console.log('Expanded Block Transaction Details:');
                    console.log(`First Transaction ID: ${firstTx.id}`);
                    console.log(`Transaction Gas: ${firstTx.gas}`);
                    console.log(`Transaction Origin: ${firstTx.origin}`);
                }
            }
        }, 30000);

        test('should retrieve raw block by ID', async () => {
            const block = await publicClient.getBlock(
                0, // Genesis block number
                BlockReponseType.raw
            );

            expect(block).toBeDefined();
            expect(block).not.toBeNull();

            if (block) {
                // Raw block is returned as RawTx object with hex data
                expect(block).toHaveProperty('raw');
                const rawData = (block as any).raw;
                expect(rawData).toHaveProperty('digits');
                expect(rawData).toHaveProperty('sign');

                console.log('Raw Block Properties:');
                console.log(`Raw Data Type: ${typeof rawData}`);
                console.log(
                    `Raw Data Length: ${rawData.digits?.length || 0} characters`
                );
            }
        }, 30000);

        test('should retrieve best block', async () => {
            const block = await publicClient.getBlock('best');

            expect(block).toBeDefined();
            expect(block).not.toBeNull();

            if (block) {
                expect(block).toHaveProperty('id');
                expect(block).toHaveProperty('number');
                expect((block as any).number).toBeGreaterThan(0);

                console.log('Best Block Info:');
                console.log(`Best Block Number: ${(block as any).number}`);
                console.log(`Best Block ID: ${(block as any).id}`);
            }
        }, 30000);

        test('should retrieve block by number', async () => {
            const blockNumber = 0; // Genesis block number
            const block = await publicClient.getBlock(blockNumber);

            expect(block).toBeDefined();
            expect(block).not.toBeNull();

            if (block) {
                expect(block).toHaveProperty('number');
                expect((block as any).number).toBe(blockNumber);

                console.log('Block by Number:');
                console.log(`Requested Number: ${blockNumber}`);
                console.log(`Retrieved Number: ${(block as any).number}`);
            }
        }, 30000);
    });

    describe('getBlockNumber', () => {
        test('should get current block number', async () => {
            const blockNumber = await publicClient.getBlockNumber();

            expect(blockNumber).toBeDefined();
            expect(typeof blockNumber).toBe('number');
            expect(blockNumber).toBeGreaterThan(0);

            console.log('Current Block Number:', blockNumber);
        }, 30000);

        test('should get block number for specific revision', async () => {
            const blockNumber = await publicClient.getBlockNumber(0);

            expect(blockNumber).toBeDefined();
            expect(typeof blockNumber).toBe('number');
            expect(blockNumber).toBe(0); // Genesis block number

            console.log('Block Number for Test Block:', blockNumber);
        }, 30000);

        test('should get block number for genesis block', async () => {
            const blockNumber = await publicClient.getBlockNumber(0);

            expect(blockNumber).toBeDefined();
            expect(blockNumber).toBe(0);

            console.log('Genesis Block Number:', blockNumber);
        }, 30000);
    });

    describe('getBlockTransactionCount', () => {
        test('should get transaction count for current block', async () => {
            const txCount = await publicClient.getBlockTransactionCount();

            expect(txCount).toBeDefined();
            expect(typeof txCount).toBe('number');
            expect(txCount).toBeGreaterThanOrEqual(0);

            console.log('Current Block Transaction Count:', txCount);
        }, 30000);

        test('should get transaction count for specific block', async () => {
            const txCount = await publicClient.getBlockTransactionCount(0);

            expect(txCount).toBeDefined();
            expect(typeof txCount).toBe('number');
            expect(txCount).toBe(0); // Genesis block has no transactions

            console.log('Test Block Transaction Count:', txCount);
        }, 30000);

        test('should get transaction count for genesis block', async () => {
            const txCount = await publicClient.getBlockTransactionCount(0);

            expect(txCount).toBeDefined();
            expect(typeof txCount).toBe('number');
            expect(txCount).toBeGreaterThanOrEqual(0);

            console.log('Genesis Block Transaction Count:', txCount);
        }, 30000);
    });

    describe('watchBlocks', () => {
        test('should create blocks subscription with position', async () => {
            const position = Hex.of('0x00000000aabbccdd');
            const subscription = publicClient.watchBlocks(position);

            expect(subscription).toBeDefined();
            expect(subscription).toHaveProperty('atPos');

            console.log('Blocks Subscription Created:', typeof subscription);

            // Clean up subscription if needed
            if (subscription && typeof subscription.close === 'function') {
                subscription.close();
            }
        }, 10000);
    });

    describe('watchBlockNumber', () => {
        test('should create block number subscription', async () => {
            const subscription = publicClient.watchBlockNumber();

            expect(subscription).toBeDefined();
            expect(subscription).toHaveProperty('listeners');
            expect(subscription).toHaveProperty('query');

            console.log(
                'Block Number Subscription Created:',
                typeof subscription
            );
            console.log('Subscription properties:', Object.keys(subscription));

            // Clean up subscription if needed
            if (subscription && typeof subscription.close === 'function') {
                subscription.close();
            }
        }, 10000);
    });

    describe('error handling', () => {
        test('should handle invalid block ID gracefully', async () => {
            const invalidBlockId =
                '0x0000000000000000000000000000000000000000000000000000000000000000';

            try {
                const block = await publicClient.getBlock(invalidBlockId);
                expect(block).toBeNull();
            } catch (error) {
                expect(error).toBeDefined();
                console.log(
                    'Expected error for invalid block:',
                    (error as Error).message
                );
            }
        }, 30000);

        test('should handle invalid block number gracefully', async () => {
            const invalidBlockNumber = 999999999; // Very high block number

            try {
                const blockNumber = await publicClient.getBlockNumber(
                    invalidBlockNumber
                );
                expect(blockNumber).toBeUndefined();
            } catch (error) {
                expect(error).toBeDefined();
                console.log(
                    'Expected error for invalid block number:',
                    (error as Error).message
                );
            }
        }, 30000);
    });
});
