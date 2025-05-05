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
     * Set up and manage a WebSocket connection in a type-safe way
     * Uses two separate implementations for browser and Node environments
     */
    const setupWebSocketConnection = (
        url: string,
        handlers: {
            onOpen?: () => void;
            onMessage: (data: string) => void;
            onError: (error: Error) => void;
        }
    ): { closeConnection: () => void } => {
        // Browser environment
        if (typeof WebSocket !== 'undefined') {
            const ws = new WebSocket(url);

            ws.onopen = (): void => {
                if (handlers.onOpen !== undefined && handlers.onOpen !== null) {
                    handlers.onOpen();
                }
            };

            ws.onmessage = (event: MessageEvent): void => {
                const data =
                    typeof event.data === 'string'
                        ? event.data
                        : JSON.stringify(event.data);
                handlers.onMessage(data);
            };

            ws.onerror = (event: Event): void => {
                handlers.onError(
                    new Error(`WebSocket error: ${String(event)}`)
                );
            };

            return {
                closeConnection: (): void => {
                    try {
                        if (ws.readyState !== 3) {
                            // 3 = CLOSED
                            ws.close();
                        }
                    } catch (e) {
                        console.error('Error closing WebSocket:', e);
                    }
                }
            };
        }
        // Node environment
        else {
            const ws = new NodeWebSocket(url);

            ws.on('open', () => {
                if (handlers.onOpen !== undefined && handlers.onOpen !== null) {
                    handlers.onOpen();
                }
            });

            ws.on('message', (data: NodeWebSocket.Data) => {
                const stringData =
                    typeof data === 'string'
                        ? data
                        : data instanceof Buffer
                          ? data.toString()
                          : JSON.stringify(data);
                handlers.onMessage(stringData);
            });

            ws.on('error', (error: Error) => {
                handlers.onError(error);
            });

            return {
                closeConnection: (): void => {
                    try {
                        if (ws.readyState !== 3) {
                            // 3 = CLOSED
                            ws.close();
                        }
                    } catch (e) {
                        console.error('Error closing WebSocket:', e);
                    }
                }
            };
        }
    };

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

            await new Promise<boolean>((resolve, reject) => {
                let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
                    if (connection !== undefined && connection !== null) {
                        connection.closeConnection();
                    }
                    reject(new Error('Timeout: No block received'));
                }, TIMEOUT);

                // Set up WebSocket connection with handlers
                const connection = setupWebSocketConnection(wsURL, {
                    onOpen: () => {
                        console.log('WebSocket connection opened.');
                    },
                    onMessage: (data: string) => {
                        if (timeoutId !== undefined && timeoutId !== null) {
                            clearTimeout(timeoutId);
                            timeoutId = null;
                        }

                        expect(data).toBeDefined();
                        expect(data).not.toBeNull();

                        const block = JSON.parse(data) as CompressedBlockDetail;
                        expect(block.number).toBeGreaterThan(0);

                        connection.closeConnection();
                        resolve(true);
                    },
                    onError: (error: Error) => {
                        if (timeoutId !== undefined && timeoutId !== null) {
                            clearTimeout(timeoutId);
                            timeoutId = null;
                        }
                        connection.closeConnection();
                        reject(error);
                    }
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

            // Set up a promise to handle WebSocket messages
            const waitForMessage = new Promise<boolean>((resolve, reject) => {
                const connection = setupWebSocketConnection(wsURL, {
                    onOpen: () => {
                        console.log('WebSocket connection opened.');
                    },
                    onMessage: (data: string) => {
                        try {
                            const log = JSON.parse(data) as EventLogs;
                            expect(log).toBeDefined();

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

                            resolve(true);
                        } catch (error) {
                            reject(
                                new Error(
                                    `Error processing WebSocket message: ${String(error)}`
                                )
                            );
                        } finally {
                            connection.closeConnection();
                        }
                    },
                    onError: (error: Error) => {
                        connection.closeConnection();
                        reject(error);
                    }
                });

                // Trigger the smart contract function that emits the event
                const triggerEvent = async (): Promise<void> => {
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
                            TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION
                                .address
                        )
                    );

                    // Send the signed transaction to the blockchain
                    await thorSoloClient.transactions.sendTransaction(
                        Transaction.decode(HexUInt.of(raw.slice(2)).bytes, true)
                    );
                };

                // Send the transaction to trigger the event
                triggerEvent().catch((error) => {
                    connection.closeConnection();
                    reject(
                        new Error(`Failed to trigger event: ${String(error)}`)
                    );
                });
            });

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

        const waitForMessage = new Promise<boolean>((resolve, reject) => {
            const connection = setupWebSocketConnection(wsURL, {
                onOpen: () => {
                    console.log('WebSocket connection opened.');
                },
                onMessage: (data: string) => {
                    try {
                        const log = JSON.parse(data) as TransferLogs;
                        expect(log).toBeDefined();
                        expect(log.sender).toBe(
                            TEST_ACCOUNTS.SUBSCRIPTION
                                .VET_TRANSFERS_SUBSCRIPTION.address
                        );
                        resolve(true);
                    } catch (error) {
                        reject(
                            new Error(
                                `Error processing WebSocket message: ${String(error)}`
                            )
                        );
                    } finally {
                        connection.closeConnection();
                    }
                },
                onError: (error: Error) => {
                    connection.closeConnection();
                    reject(error);
                }
            });

            // Trigger VET transfer
            const triggerTransfer = async (): Promise<void> => {
                const clause: TransactionClause = {
                    to: TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: Units.parseEther('1').toString(),
                    data: '0x'
                };
                const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
                const gasResult = await thorSoloClient.gas.estimateGas(
                    [clause],
                    TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                        .address
                );
                const txBody =
                    await thorSoloClient.transactions.buildTransactionBody(
                        [clause],
                        gasResult.totalGas
                    );

                // Create a signer to sign the transaction
                const signer = (await provider.getSigner(
                    TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                        .address
                )) as VeChainPrivateKeySigner;

                // Get the raw transaction
                const raw = await signer.signTransaction(
                    signerUtils.transactionBodyToTransactionRequestInput(
                        txBody,
                        TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                            .address
                    )
                );

                // Send the signed transaction to the blockchain
                await thorSoloClient.transactions.sendTransaction(
                    Transaction.decode(HexUInt.of(raw.slice(2)).bytes, true)
                );
            };

            // Send the transaction to trigger the transfer
            triggerTransfer().catch((error) => {
                connection.closeConnection();
                reject(
                    new Error(`Failed to trigger transfer: ${String(error)}`)
                );
            });
        });

        // Wait for the WebSocket message or a timeout
        await expect(waitForMessage).resolves.toBe(true);
    });
});
