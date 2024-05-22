import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    type Clause,
    type CompressedBlockDetail,
    type EventFragment,
    type EventLogs,
    signerUtils,
    subscriptions,
    ThorClient,
    type TransferLogs,
    type VechainPrivateKeySigner,
    VechainProvider
} from '../../../src';
import {
    soloUrl,
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    THOR_SOLO_ACCOUNTS_BASE_WALLET
} from '../../fixture';
import WebSocket from 'ws';
import {
    addressUtils,
    clauseBuilder,
    coder,
    type FunctionFragment,
    TransactionHandler,
    unitsUtils
} from '@vechain/sdk-core';

const TIMEOUT = 15000; // 15-second timeout

/**
 * Test suite for the Subscriptions utility methods for listening to events obtained through a websocket connection.
 *
 * @group integration/utils/subscriptions
 */
describe('Subscriptions Solo network tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VechainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.fromUrl(soloUrl);
        provider = new VechainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET,
            false
        );
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    test(
        'Should receive new blocks from the block subscription',
        async () => {
            const wsURL = subscriptions.getBlockSubscriptionUrl(soloUrl);

            const ws = new WebSocket(wsURL);

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    ws.close();
                    reject(new Error('Timeout: No block received'));
                }, TIMEOUT); // 15-second timeout

                ws.on('message', (data) => {
                    clearTimeout(timeout); // Clear the timeout on receiving a message
                    ws.close(); // Close the WebSocket connection

                    expect(data).toBeDefined(); // Basic assertion to ensure data is received
                    expect(data).not.toBeNull(); // Basic assertion to ensure data is received

                    const block = JSON.parse(
                        data.toLocaleString()
                    ) as CompressedBlockDetail;

                    expect(block.number).toBeGreaterThan(0); // Basic assertion to ensure the block number is valid

                    resolve(true);
                });

                ws.on('error', (error) => {
                    clearTimeout(timeout); // Clear the timeout in case of an error
                    reject(error); // Reject the promise with the error
                });
            });
        },
        TIMEOUT
    );

    /**
     * Test the getEventSubscriptionUrl function
     */
    test(
        'Should receive smart contract event logs from the event subscription',
        async () => {
            // Create an interface for the smart contract ABI
            const testingContractInterface =
                coder.createInterface(TESTING_CONTRACT_ABI);

            // Get the event fragment for the StateChanged event
            const eventFragment =
                testingContractInterface.getEvent('StateChanged');

            // Get the URL for the event subscription
            const wsURL = subscriptions.getEventSubscriptionUrl(
                soloUrl,
                eventFragment as EventFragment,
                // Receive only events emitted that involve the EVENT_SUBSCRIPTION account address as the third indexed parameter of `event StateChanged(uint indexed newValue, uint indexed oldValue, address indexed sender, uint timestamp);`
                [
                    null,
                    null,
                    TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
                ]
            );

            // Create a WebSocket connection
            const ws = new WebSocket(wsURL);

            // Set up a promise to handle WebSocket messages
            const waitForMessage = new Promise((resolve, reject) => {
                ws.on('message', (data) => {
                    try {
                        const log = JSON.parse(
                            data.toLocaleString()
                        ) as EventLogs;
                        expect(log).toBeDefined(); // Your assertion here

                        const decodedLog =
                            testingContractInterface.decodeEventLog(
                                'StateChanged',
                                log.data,
                                log.topics
                            );

                        expect(decodedLog.length).toBe(4);
                        expect(decodedLog[2]).toBe(
                            addressUtils.toERC55Checksum(
                                TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION
                                    .address
                            )
                        );

                        resolve(true); // Resolve the promise when a message is received
                    } catch (error) {
                        reject(error); // Reject the promise on error
                    } finally {
                        ws.close(); // Ensure WebSocket is closed
                    }
                });

                ws.on('error', (error) => {
                    reject(error); // Reject the promise on WebSocket error
                });
            });

            // Trigger the smart contract function that emits the event
            const clause = clauseBuilder.functionInteraction(
                TESTING_CONTRACT_ADDRESS,
                coder
                    .createInterface(TESTING_CONTRACT_ABI)
                    .getFunction('setStateVariable') as FunctionFragment,
                [1]
            );
            const thorSoloClient = ThorClient.fromUrl(soloUrl);
            const gasResult = await thorSoloClient.gas.estimateGas(
                [clause],
                TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
            );
            const txBody =
                await thorSoloClient.transactions.buildTransactionBody(
                    [clause],
                    gasResult.totalGas
                );

            // Create a signer to sign the transaction
            const signer = (await provider.getSigner(
                TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
            )) as VechainPrivateKeySigner;

            // Get the raw transaction
            const raw = await signer.signTransaction(
                signerUtils.transactionBodyToTransactionRequestInput(
                    txBody,
                    TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
                )
            );

            // Send the signed transaction to the blockchain
            await thorSoloClient.transactions.sendTransaction(
                TransactionHandler.decode(
                    Buffer.from(raw.slice(2), 'hex'),
                    true
                )
            );

            // Wait for the WebSocket message or a timeout
            await expect(waitForMessage).resolves.toBe(true);
        },
        TIMEOUT
    );

    /**
     * Test the getVETtransfersSubscriptionUrl function
     */
    test('Should receive VET transfers from the VET transfers subscription', async () => {
        const wsURL = subscriptions.getVETtransfersSubscriptionUrl(soloUrl, {
            sender: TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                .address
        });

        const ws = new WebSocket(wsURL);

        const waitForMessage = new Promise((resolve, reject) => {
            ws.on('message', (data) => {
                try {
                    const log = JSON.parse(
                        data.toLocaleString()
                    ) as TransferLogs;

                    expect(log).toBeDefined(); // Your assertion here

                    expect(log.sender).toBe(
                        TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                            .address
                    );

                    resolve(true); // Resolve the promise when a message is received
                } catch (error) {
                    reject(error); // Reject the promise on error
                } finally {
                    ws.close(); // Ensure WebSocket is closed
                }
            });

            ws.on('error', (error) => {
                reject(error); // Reject the promise on WebSocket error
            });
        });

        // Trigger the smart contract function that emits the event
        const clause: Clause = {
            to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            value: unitsUtils.parseVET('1').toString(),
            data: '0x'
        };
        const thorSoloClient = ThorClient.fromUrl(soloUrl);
        const gasResult = await thorSoloClient.gas.estimateGas(
            [clause],
            TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION.address
        );
        const txBody = await thorSoloClient.transactions.buildTransactionBody(
            [clause],
            gasResult.totalGas
        );

        // Create a signer to sign the transaction
        const signer = (await provider.getSigner(
            TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION.address
        )) as VechainPrivateKeySigner;

        // Get the raw transaction
        const raw = await signer.signTransaction(
            signerUtils.transactionBodyToTransactionRequestInput(
                txBody,
                TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION.address
            )
        );

        // Send the signed transaction to the blockchain
        await thorSoloClient.transactions.sendTransaction(
            TransactionHandler.decode(Buffer.from(raw.slice(2), 'hex'), true)
        );

        // Wait for the WebSocket message or a timeout
        await expect(waitForMessage).resolves.toBe(true);
    });
});
