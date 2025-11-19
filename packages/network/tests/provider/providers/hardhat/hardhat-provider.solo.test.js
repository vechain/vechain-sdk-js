"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../../src");
const fixture_1 = require("../fixture");
const fixture_2 = require("../../../fixture");
/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
(0, globals_1.describe)('Hardhat provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let provider;
    let fundedAccount;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Use a funded account from TEST_ACCOUNTS
        const account = fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION;
        fundedAccount = {
            privateKey: account.privateKey,
            address: account.address
        };
        provider = new src_1.HardhatVeChainProvider(new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(fundedAccount.privateKey).bytes,
                address: fundedAccount.address
            }
        ]), src_1.THOR_SOLO_URL, (message, parent) => new Error(message, parent), false);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    /**
     * Provider methods tests
     */
    fixture_1.providerMethodsTestCasesSolo.forEach(({ description, method, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            // Call RPC function
            const rpcCall = await provider.request({
                method,
                params
            });
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
        });
    });
    /**
     * eth_getBalance RPC call test
     */
    (0, globals_1.test)('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_blockNumber',
            params: []
        });
        // Compare the result with the expected value
        (0, globals_1.expect)(rpcCall).not.toBe('0x0');
    });
    /**
     * eth_subscribe latest blocks RPC call test
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest blocks', async () => {
        // Call RPC function
        const subscriptionId = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });
        const messageReceived = new Promise((resolve) => {
            provider.on('message', (message) => {
                resolve(message);
                provider.destroy();
            });
        });
        const message = (await messageReceived);
        // Optionally, you can do assertions or other operations with the message
        (0, globals_1.expect)(message).toBeDefined();
        (0, globals_1.expect)(message.method).toBe('eth_subscription');
        (0, globals_1.expect)(message.params).toBeDefined();
        (0, globals_1.expect)(message.params.subscription).toBe(subscriptionId);
        (0, globals_1.expect)(message.params.result).toBeDefined();
    }, 12000);
    /**
     * eth_subscribe latest blocks and then unsubscribe RPC call test
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest blocks and then unsubscribe', async () => {
        (0, globals_1.expect)(provider.getPollInstance()).toBeUndefined();
        // Call RPC function
        const subscriptionId = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });
        (0, globals_1.expect)(provider.getPollInstance()).toBeDefined();
        (0, globals_1.expect)(subscriptionId).toBeDefined();
        (0, globals_1.expect)(provider.subscriptionManager.newHeadsSubscription?.subscriptionId).toBe(subscriptionId);
        await provider.request({
            method: 'eth_unsubscribe',
            params: [subscriptionId]
        });
        (0, globals_1.expect)(provider.getPollInstance()).toBeUndefined();
        (0, globals_1.expect)(provider.subscriptionManager.newHeadsSubscription?.subscriptionId).toBeUndefined();
    });
    /**
     * eth_getSubscribe invalid call
     */
    (0, globals_1.test)('Should not be able to subscribe since the subscription type is invalid', async () => {
        // Call RPC function
        await (0, globals_1.expect)(async () => await provider.request({
            method: 'eth_subscribe',
            params: ['invalid']
        })).rejects.toThrowError();
    }, 12000);
    /**
     * Invalid RPC method tests
     */
    (0, globals_1.test)('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        (0, globals_1.expect)(provider).toBeDefined();
        // Call RPC function
        await (0, globals_1.expect)(async () => await provider.request({
            method: 'INVALID_METHOD',
            params: [-1]
        })).rejects.toThrowError();
    });
});
