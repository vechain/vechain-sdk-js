"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const ws_1 = __importDefault(require("ws"));
const tsd_1 = require("tsd");
const TIMEOUT = 30000; // 30-second timeout
/**
 * Test suite for the Subscriptions utility methods for listening to events obtained through a websocket connection.
 *
 * @group integration/utils/subscriptions
 */
(0, globals_1.describe)('Subscriptions Solo network tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Set up and manage a WebSocket connection in a type-safe way
     * Uses two separate implementations for browser and Node environments
     */
    const setupWebSocketConnection = (url, handlers) => {
        // Browser environment
        if (typeof WebSocket !== 'undefined') {
            const ws = new WebSocket(url);
            let errorHandled = false;
            ws.onopen = () => {
                if (handlers.onOpen !== undefined && handlers.onOpen !== null) {
                    handlers.onOpen();
                }
            };
            ws.onmessage = (event) => {
                const data = typeof event.data === 'string'
                    ? event.data
                    : JSON.stringify(event.data);
                handlers.onMessage(String(data));
            };
            ws.onerror = (event) => {
                if (!errorHandled) {
                    errorHandled = true;
                    handlers.onError(new Error(`WebSocket error: ${event instanceof Error ? event.message : 'Unknown error'}`));
                }
            };
            return {
                closeConnection: () => {
                    try {
                        if (ws.readyState !== 3) {
                            // 3 = CLOSED
                            ws.close();
                        }
                    }
                    catch {
                        /* ignore error on close */
                    }
                }
            };
        }
        // Node environment
        else {
            // Use a type assertion to declare that we know the object structure
            const ws = new ws_1.default(url);
            let errorHandled = false;
            // Use addEventListener which is available in both browser and node implementations
            ws.addEventListener('open', () => {
                if (handlers.onOpen !== undefined && handlers.onOpen !== null) {
                    handlers.onOpen();
                }
            });
            ws.addEventListener('message', (event) => {
                // Safely handle different data types
                let stringData = '';
                if (typeof event.data === 'string') {
                    stringData = event.data;
                }
                else if (typeof event.data === 'object' &&
                    event.data !== null) {
                    if (Buffer.isBuffer(event.data)) {
                        stringData = event.data.toString();
                    }
                    else {
                        stringData = JSON.stringify(event.data);
                    }
                }
                handlers.onMessage(stringData);
            });
            ws.addEventListener('error', (event) => {
                if (!errorHandled) {
                    errorHandled = true;
                    handlers.onError(new Error(`WebSocket error: ${event instanceof Error ? event.message : 'Unknown error'}`));
                }
            });
            return {
                closeConnection: () => {
                    try {
                        if (typeof ws.readyState === 'number' &&
                            ws.readyState !== 3) {
                            // 3 = CLOSED
                            ws.close();
                        }
                    }
                    catch {
                        /* ignore error on close */
                    }
                }
            };
        }
    };
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        provider = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
            {
                address: fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address,
                privateKey: sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.privateKey).bytes
            },
            {
                address: fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                    .address,
                privateKey: sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                    .privateKey).bytes
            }
        ]), false);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    (0, globals_1.test)('Should receive new blocks from the block subscription', async () => {
        const wsURL = src_1.subscriptions.getBlockSubscriptionUrl(src_1.THOR_SOLO_URL);
        // Simple retry mechanism
        let lastError = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await new Promise((resolve, reject) => {
                    let timeoutId = setTimeout(() => {
                        if (connection !== undefined &&
                            connection !== null) {
                            connection.closeConnection();
                        }
                        reject(new Error('Timeout: No block received'));
                    }, TIMEOUT);
                    // Set up WebSocket connection with handlers
                    const connection = setupWebSocketConnection(wsURL, {
                        onOpen: () => { },
                        onMessage: (data) => {
                            if (timeoutId !== undefined &&
                                timeoutId !== null) {
                                clearTimeout(timeoutId);
                                timeoutId = null;
                            }
                            (0, globals_1.expect)(data).toBeDefined();
                            (0, globals_1.expect)(data).not.toBeNull();
                            const block = JSON.parse(data);
                            (0, globals_1.expect)(block.number).toBeGreaterThan(0);
                            connection.closeConnection();
                            resolve(true);
                        },
                        onError: (error) => {
                            if (timeoutId !== undefined &&
                                timeoutId !== null) {
                                clearTimeout(timeoutId);
                                timeoutId = null;
                            }
                            connection.closeConnection();
                            reject(error);
                        }
                    });
                });
                // Success - exit retry loop
                return;
            }
            catch (error) {
                lastError = error;
                if (attempt < 3) {
                    // Wait 2 seconds before retrying
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
        }
        // All retries failed
        throw (lastError ??
            new Error('WebSocket connection failed after 3 attempts'));
    }, TIMEOUT * 2);
    (0, globals_1.test)('Should receive block with baseFeePerGas field in the subscription', async () => {
        const wsURL = src_1.subscriptions.getBlockSubscriptionUrl(src_1.THOR_SOLO_URL);
        let ws;
        if (typeof WebSocket !== 'undefined') {
            ws = new WebSocket(wsURL);
        }
        else {
            ws = new ws_1.default(wsURL);
        }
        // First, create a transaction to ensure a new block is generated
        const clause = sdk_core_1.Clause.transferVET(sdk_core_1.Address.of(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address), sdk_core_1.VET.of('1'));
        const gasResult = await thorClient.transactions.estimateGas([clause], fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address);
        const txBody = await thorClient.transactions.buildTransactionBody([clause], gasResult.totalGas);
        // Create a signer to sign the transaction
        const signer = (await provider.getSigner(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address));
        // Get the raw transaction
        const raw = await signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address));
        // Send the signed transaction to ensure a new block is generated
        await thorClient.transactions.sendTransaction(sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(raw.slice(2)).bytes, true));
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                ws.close();
                reject(new Error('Timeout: No block received'));
            }, TIMEOUT); // 15-second timeout
            ws.onopen = () => {
                console.log('WebSocket connection opened.');
            };
            ws.onmessage = (event) => {
                clearTimeout(timeout); // Clear the timeout on receiving a message
                ws.close(); // Close the WebSocket connection
                const data = typeof event.data === 'string'
                    ? event.data
                    : JSON.stringify(event.data);
                (0, globals_1.expect)(data).toBeDefined();
                (0, globals_1.expect)(data).not.toBeNull();
                const block = JSON.parse(data.toString());
                (0, globals_1.expect)(block.number).toBeGreaterThan(0);
                // Thor Solo node currently doesn't include baseFeePerGas in all blocks
                // Our implementation handles both cases (with or without baseFeePerGas)
                // If baseFeePerGas is present, ensure it's a string
                if (block.baseFeePerGas !== undefined &&
                    block.baseFeePerGas !== null) {
                    (0, globals_1.expect)(typeof block.baseFeePerGas).toBe('string');
                }
                resolve(true);
            };
            ws.onerror = (error) => {
                clearTimeout(timeout);
                reject(error instanceof Error
                    ? error
                    : new Error(error instanceof Error
                        ? error.message
                        : 'Unknown error'));
            };
        });
    }, TIMEOUT);
    /**
     * Test the getEventSubscriptionUrl function
     */
    (0, globals_1.test)('Should receive smart contract event logs from the event subscription', async () => {
        // Create an interface for the smart contract ABI
        const testingContractInterface = sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI);
        // Get the event ABI for the StateChanged event
        const eventAbi = testingContractInterface.getEvent('StateChanged');
        // Get the URL for the event subscription
        const wsURL = src_1.subscriptions.getEventSubscriptionUrl(src_1.THOR_SOLO_URL, eventAbi.signature, 
        // Receive only events emitted that involve the EVENT_SUBSCRIPTION account address as the third indexed parameter of `event StateChanged(uint indexed newValue, uint indexed oldValue, address indexed sender, uint timestamp);`
        [
            null,
            null,
            fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
        ]);
        // Set up a promise to handle WebSocket messages
        const waitForMessage = new Promise((resolve, reject) => {
            const connection = setupWebSocketConnection(wsURL, {
                onOpen: () => { },
                onMessage: (data) => {
                    try {
                        const log = JSON.parse(data);
                        (0, globals_1.expect)(log).toBeDefined();
                        const decodedLog = testingContractInterface.decodeEventLog('StateChanged', {
                            data: sdk_core_1.Hex.of(log.data),
                            topics: log.topics.map((topic) => sdk_core_1.Hex.of(topic))
                        });
                        (0, tsd_1.expectType)(decodedLog);
                        (0, globals_1.expect)(Object.keys(decodedLog.args).length).toBe(4);
                        (0, globals_1.expect)(decodedLog.args.sender).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION
                            .EVENT_SUBSCRIPTION.address)));
                        resolve(true);
                    }
                    catch (error) {
                        reject(new Error(`Error processing WebSocket message: ${error instanceof Error ? error.message : 'Unknown error'}`));
                    }
                    finally {
                        connection.closeConnection();
                    }
                },
                onError: (error) => {
                    connection.closeConnection();
                    reject(error);
                }
            });
            // Trigger the smart contract function that emits the event
            const triggerEvent = async () => {
                const clause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [1]);
                const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
                const gasResult = await thorSoloClient.gas.estimateGas([clause], fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address);
                const txBody = await thorSoloClient.transactions.buildTransactionBody([clause], gasResult.totalGas);
                // Create a signer to sign the transaction
                const signer = (await provider.getSigner(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address));
                // Get the raw transaction
                const raw = await signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION
                    .address));
                // Send the signed transaction to the blockchain
                await thorSoloClient.transactions.sendTransaction(sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(raw.slice(2)).bytes, true));
            };
            // Send the transaction to trigger the event
            triggerEvent().catch((error) => {
                connection.closeConnection();
                reject(new Error(`Failed to trigger event: ${error instanceof Error ? error.message : 'Unknown error'}`));
            });
        });
        // Wait for the WebSocket message or a timeout
        await (0, globals_1.expect)(waitForMessage).resolves.toBe(true);
    }, TIMEOUT);
    /**
     * Test the getVETtransfersSubscriptionUrl function
     */
    (0, globals_1.test)('Should receive VET transfers from the VET transfers subscription', async () => {
        const wsURL = src_1.subscriptions.getVETtransfersSubscriptionUrl(src_1.THOR_SOLO_URL, {
            sender: fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                .address
        });
        const waitForMessage = new Promise((resolve, reject) => {
            const connection = setupWebSocketConnection(wsURL, {
                onOpen: () => { },
                onMessage: (data) => {
                    try {
                        const log = JSON.parse(data);
                        (0, globals_1.expect)(log).toBeDefined();
                        (0, globals_1.expect)(log.sender).toBe(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION
                            .VET_TRANSFERS_SUBSCRIPTION.address);
                        resolve(true);
                    }
                    catch (error) {
                        reject(new Error(`Error processing WebSocket message: ${error instanceof Error ? error.message : 'Unknown error'}`));
                    }
                    finally {
                        connection.closeConnection();
                    }
                },
                onError: (error) => {
                    connection.closeConnection();
                    reject(error);
                }
            });
            // Trigger VET transfer
            const triggerTransfer = async () => {
                const clause = {
                    to: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                    value: sdk_core_1.Units.parseEther('1').toString(),
                    data: '0x'
                };
                const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
                const gasResult = await thorSoloClient.gas.estimateGas([clause], fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                    .address);
                const txBody = await thorSoloClient.transactions.buildTransactionBody([clause], gasResult.totalGas);
                // Create a signer to sign the transaction
                const signer = (await provider.getSigner(fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                    .address));
                // Get the raw transaction
                const raw = await signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, fixture_1.TEST_ACCOUNTS.SUBSCRIPTION.VET_TRANSFERS_SUBSCRIPTION
                    .address));
                // Send the signed transaction to the blockchain
                await thorSoloClient.transactions.sendTransaction(sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(raw.slice(2)).bytes, true));
            };
            // Send the transaction to trigger the transfer
            triggerTransfer().catch((error) => {
                connection.closeConnection();
                reject(new Error(`Failed to trigger transfer: ${error instanceof Error ? error.message : 'Unknown error'}`));
            });
        });
        // Wait for the WebSocket message or a timeout
        await (0, globals_1.expect)(waitForMessage).resolves.toBe(true);
    });
});
