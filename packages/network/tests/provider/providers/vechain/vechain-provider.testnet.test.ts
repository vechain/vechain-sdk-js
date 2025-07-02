import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    afterAll
} from '@jest/globals';

import {
    JSONRPCMethodNotFound,
    JSONRPCMethodNotImplemented
} from '@vechain/sdk-errors';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../src';
import { providerMethodsTestCasesTestnet } from '../fixture';
import { waitForMessage } from '../helpers';

/**
 *VeChain provider tests
 *
 * @group integration/providers/vechain-provider
 */
describe('VeChain provider tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        // Remove all event listeners
        provider.removeAllListeners();
        provider.destroy();
    });

    /**
     * Global cleanup to ensure all resources are released
     */
    afterAll(() => {
        // Force cleanup of any remaining timers/intervals
        jest.clearAllTimers();
    });

    /**
     * Provider methods tests
     */
    providerMethodsTestCasesTestnet.forEach(
        ({ description, method, params, expected }) => {
            test(description, async () => {
                // Call RPC function
                const rpcCall = await provider.request({
                    method,
                    params
                });

                // Compare the result with the expected value
                expect(rpcCall).toStrictEqual(expected);
            });
        }
    );

    /**
     * eth_blockNumber RPC call test
     */
    test('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_blockNumber',
            params: []
        });

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    });

    /**
     * eth_subscribe latest blocks RPC call test
     */
    test('Should be able to get to subscribe to the latest blocks', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        const messageReceived = waitForMessage(provider);

        const message = await messageReceived;

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message.method).toBe('eth_subscription');
        expect(message.params.subscription).toBeDefined();

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    }, 12000);

    /**
     * eth_getBalance RPC call test
     */

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(provider).toBeDefined();

        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'INVALID_METHOD',
                    params: [-1]
                })
        ).rejects.toThrowError(JSONRPCMethodNotFound);
    });

    /**
     * Return null signer if wallet is not defined
     */
    test('Should throw an error if delegation is enabled and gasPayer is not defined', async () => {
        const nullSigner = await provider.getSigner(
            '0x0000000000000000000000000000456e65726779'
        );
        expect(nullSigner).toBeNull();
    });

    /**
     * Method not implemented and method not found tests
     */
    describe('Method not implemented and method not found', () => {
        /**
         * Test for method in RPC_METHODS enum but not in RPCMethodsMap
         */
        test('Should throw JSONRPCMethodNotImplemented for method in enum but not in map', async () => {
            // Assuming eth_getProof is in the enum but commented out in the map
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_getProof,
                    params: []
                })
            ).rejects.toThrowError(JSONRPCMethodNotImplemented);
        });

        /**
         * Test for method not in RPC_METHODS enum
         */
        test('Should throw JSONRPCMethodNotFound for method not in enum', async () => {
            await expect(
                provider.request({
                    method: 'non_existent_method',
                    params: []
                })
            ).rejects.toThrowError(JSONRPCMethodNotFound);
        });
    });
});
