import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    ABIContract,
    Address,
    Clause,
    Hex,
    HexUInt,
    Transaction,
    type TransactionClause,
    Units
} from '@vechain/sdk-core';
import { type AbiEvent } from 'abitype';
import {
    type CompressedBlockDetail,
    type EventLogs,
    ProviderInternalBaseWallet,
    signerUtils,
    subscriptions,
    THOR_SOLO_URL,
    ThorClient,
    type TransferLogs,
    type VeChainPrivateKeySigner,
    VeChainProvider
} from '../../../src';
import {
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../fixture';
// eslint-disable-next-line import/no-named-default
import { default as NodeWebSocket } from 'isomorphic-ws';
import { expectType } from 'tsd';

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
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(THOR_SOLO_URL);
        provider = new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([
                {
                    address:
                        TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address,
                    privateKey: HexUInt.of(
                        TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.privateKey
                    ).bytes
                },
                {
                    address:
                        TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                            .address,
                    privateKey: HexUInt.of(
                        TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                            .privateKey
                    ).bytes
                }
            ]),
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
            const wsURL = subscriptions.getBlockSubscriptionUrl(THOR_SOLO_URL);

            let ws: WebSocket | NodeWebSocket;
            if (typeof WebSocket !== 'undefined') {
                ws = new WebSocket(wsURL);
            } else {
                ws = new NodeWebSocket(wsURL);
            }

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    ws.close();
                    reject(new Error('Timeout: No block received'));
                }, TIMEOUT); // 15-second timeout

                ws.onopen = () => {
                    console.log('WebSocket connection opened.');
                };

                ws.onmessage = (event: MessageEvent) => {
                    clearTimeout(timeout); // Clear the timeout on receiving a message
                    ws.close(); // Close the WebSocket connection

                    const data: string =
                        typeof event.data === 'string'
                            ? event.data
                            : JSON.stringify(event.data);
                    expect(data).toBeDefined(); // Basic assertion to ensure data is received
                    expect(data).not.toBeNull(); // Basic assertion to ensure data is received

                    const block = JSON.parse(
                        data.toString()
                    ) as CompressedBlockDetail;

                    expect(block.number).toBeGreaterThan(0); // Basic assertion to ensure the block number is valid

                    resolve(true);
                };

                ws.onerror = (error: Event) => {
                    clearTimeout(timeout); // Clear the timeout in case of an error
                    reject(
                        new Error(
                            'Error processing WebSocket message: ' +
                                String(error)
                        )
                    );
                };
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
                ABIContract.ofAbi(TESTING_CONTRACT_ABI);

            // Get the event ABI for the StateChanged event
            const eventAbi = testingContractInterface.getEvent('StateChanged');

            // Get the URL for the event subscription
            const wsURL = subscriptions.getEventSubscriptionUrl(
                THOR_SOLO_URL,
                eventAbi.signature as AbiEvent,
                // Receive only events emitted that involve the EVENT_SUBSCRIPTION account address as the third indexed parameter of `event StateChanged(uint indexed newValue, uint indexed oldValue, address indexed sender, uint timestamp);`
                [
                    null,
                    null,
                    TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
                ]
            );

            // Create a WebSocket connection
            let ws: WebSocket | NodeWebSocket;
            if (typeof WebSocket !== 'undefined') {
                ws = new WebSocket(wsURL);
            } else {
                ws = new NodeWebSocket(wsURL);
            }

            // Set up a promise to handle WebSocket messages
            const waitForMessage = new Promise((resolve, reject) => {
                ws.onopen = () => {
                    console.log('WebSocket connection opened.');
                };

                ws.onmessage = (event: MessageEvent) => {
                    const data: string =
                        typeof event.data === 'string'
                            ? event.data
                            : JSON.stringify(event.data);
                    try {
                        const log = JSON.parse(data) as EventLogs;
                        expect(log).toBeDefined(); // Your assertion here

                        const decodedLog =
                            testingContractInterface.decodeEventLog(
                                'StateChanged',
                                {
                                    data: Hex.of(log.data),
                                    topics: log.topics.map((topic) =>
                                        Hex.of(topic)
                                    )
                                }
                            ) as {
                                eventName: 'StateChanged';
                                args: {
                                    newValue: bigint;
                                    oldValue: bigint;
                                    sender: string;
                                    timestamp: bigint;
                                };
                            };
                        expectType<{
                            eventName: 'StateChanged';
                            args: {
                                newValue: bigint;
                                oldValue: bigint;
                                sender: string;
                                timestamp: bigint;
                            };
                        }>(decodedLog);
                        expect(Object.keys(decodedLog.args).length).toBe(4);
                        expect(decodedLog.args.sender).toBe(
                            Address.checksum(
                                HexUInt.of(
                                    TEST_ACCOUNTS.SUBSCRIPTION
                                        .EVENT_SUBSCRIPTION.address
                                )
                            )
                        );

                        resolve(true); // Resolve the promise when a message is received
                    } catch (error) {
                        reject(
                            new Error(
                                'Error processing WebSocket message: ' +
                                    String(error)
                            )
                        );
                    } finally {
                        ws.close(); // Ensure WebSocket is closed
                    }
                };

                ws.onerror = (error: Event) => {
                    reject(
                        new Error(
                            'Error processing WebSocket message: ' +
                                String(error)
                        )
                    );
                };
            });
            const clause = Clause.callFunction(
                Address.of(TESTING_CONTRACT_ADDRESS),
                ABIContract.ofAbi(TESTING_CONTRACT_ABI).getFunction(
                    'setStateVariable'
                ),
                [1]
            ) as TransactionClause;
            const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
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
            )) as VeChainPrivateKeySigner;

            // Get the raw transaction
            const raw = await signer.signTransaction(
                signerUtils.transactionBodyToTransactionRequestInput(
                    txBody,
                    TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
                )
            );

            // Send the signed transaction to the blockchain
            await thorSoloClient.transactions.sendTransaction(
                Transaction.decode(HexUInt.of(raw.slice(2)).bytes, true)
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
        const wsURL = subscriptions.getVETtransfersSubscriptionUrl(
            THOR_SOLO_URL,
            {
                sender: TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                    .address
            }
        );

        let ws: WebSocket | NodeWebSocket;
        if (typeof WebSocket !== 'undefined') {
            ws = new WebSocket(wsURL);
        } else {
            ws = new NodeWebSocket(wsURL);
        }

        const waitForMessage = new Promise((resolve, reject) => {
            ws.onopen = () => {
                console.log('WebSocket connection opened.');
            };

            ws.onmessage = (event: MessageEvent) => {
                const data: string =
                    typeof event.data === 'string'
                        ? event.data
                        : JSON.stringify(event.data);
                try {
                    const log = JSON.parse(data) as TransferLogs;

                    expect(log).toBeDefined(); // Your assertion here

                    expect(log.sender).toBe(
                        TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                            .address
                    );

                    resolve(true); // Resolve the promise when a message is received
                } catch (error) {
                    reject(
                        new Error(
                            'Error processing WebSocket message: ' +
                                String(error)
                        )
                    );
                } finally {
                    ws.close(); // Ensure WebSocket is closed
                }
            };

            ws.onerror = (error: Event) => {
                reject(
                    new Error(
                        'Error processing WebSocket message: ' + String(error)
                    )
                );
            };
        });

        // Trigger the smart contract function that emits the event
        const clause: TransactionClause = {
            to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            value: Units.parseEther('1').toString(),
            data: '0x'
        };
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
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
        )) as VeChainPrivateKeySigner;

        // Get the raw transaction
        const raw = await signer.signTransaction(
            signerUtils.transactionBodyToTransactionRequestInput(
                txBody,
                TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION.address
            )
        );

        // Send the signed transaction to the blockchain
        await thorSoloClient.transactions.sendTransaction(
            Transaction.decode(HexUInt.of(raw.slice(2)).bytes, true)
        );

        // Wait for the WebSocket message or a timeout
        await expect(waitForMessage).resolves.toBe(true);
    });
});
