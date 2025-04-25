import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import { THOR_SOLO_ACCOUNTS_BASE_WALLET } from '../../../../fixture';
import { Hex } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { eip712TestCases } from '../../../../signer/signers/vechain-private-key-signer/fixture';
import { THOR_SOLO_SEEDED_ACCOUNTS } from '@vechain/sdk-solo-setup';

/**
 * RPC Mapper integration tests for 'eth_signTypedData_v4' method
 *
 * @group integration/rpc-mapper/methods/eth_signTypedData_v4
 */
describe('RPC Mapper - eth_signTypedData_v4 method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Provider instance
     */
    let provider: VeChainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);

        // Init provider
        // @NOTE: Since we are testing the signature, we can use SOLO accounts with testnet!
        provider = new VeChainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET
        );
    });

    /**
     * eth_signTypedData_v4 RPC call tests - Positive cases
     */
    describe('eth_signTypedData_v4 - Positive cases', () => {
        /**
         * Should be able to sign a typed message
         */
        test('Should be able to sign a typed message', async () => {
            const signedTransaction = (await provider.request({
                method: RPC_METHODS.eth_signTypedData_v4,
                params: [
                    THOR_SOLO_SEEDED_ACCOUNTS[0].address,
                    {
                        domain: eip712TestCases.valid.domain,
                        types: eip712TestCases.valid.types,
                        message: eip712TestCases.valid.data,
                        primaryType: eip712TestCases.valid.primaryType
                    }
                ]
            })) as string;

            // Signed transaction should be a hex string
            expect(Hex.isValid0x(signedTransaction)).toBe(true);
        });

        /**
         * Should be able to sign a typed message with a JSON string as input
         */
        test('Should be able to sign a typed message with a JSON string as input', async () => {
            const typedDataString = JSON.stringify({
                domain: eip712TestCases.valid.domain,
                types: eip712TestCases.valid.types,
                message: eip712TestCases.valid.data,
                primaryType: eip712TestCases.valid.primaryType
            });

            const signedTransaction = (await provider.request({
                method: RPC_METHODS.eth_signTypedData_v4,
                params: [THOR_SOLO_SEEDED_ACCOUNTS[0].address, typedDataString]
            })) as string;

            // Signed transaction should be a hex string
            expect(Hex.isValid0x(signedTransaction)).toBe(true);
        });
    });

    /**
     * eth_signTypedData_v4 RPC call tests - Negative cases
     */
    describe('eth_signTypedData_v4 - Negative cases', () => {
        /**
         * Should be NOT able to sign an invalid typed message
         */
        test('Should be NOT able to sign an invalid typed message', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTypedData_v4,
                    params: [
                        THOR_SOLO_SEEDED_ACCOUNTS[0].address,
                        {
                            domain: 'INVALID',
                            types: eip712TestCases.valid.types,
                            message: eip712TestCases.valid.data,
                            primaryType: eip712TestCases.valid.primaryType
                        }
                    ]
                })
            ).rejects.toThrowError(JSONRPCInternalError);
        });

        /**
         * Should be NOT able to sign with an invalid JSON string
         */
        test('Should be NOT able to sign with an invalid JSON string', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTypedData_v4,
                    params: [
                        THOR_SOLO_SEEDED_ACCOUNTS[0].address,
                        '{invalid json string'
                    ]
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should be NOT able to sign a valid message without a wallet/provider
         */
        test('Should be NOT able to sign a valid message without a wallet/provider', async () => {
            // Provider without a wallet
            const providerWithoutWallet = new VeChainProvider(thorClient);

            // Sign without a wallet
            await expect(
                providerWithoutWallet.request({
                    method: RPC_METHODS.eth_signTypedData_v4,
                    params: [
                        THOR_SOLO_SEEDED_ACCOUNTS[0].address,
                        {
                            domain: eip712TestCases.valid.domain,
                            types: eip712TestCases.valid.types,
                            message: eip712TestCases.valid.data,
                            primaryType: eip712TestCases.valid.primaryType
                        }
                    ]
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should be NOT able to sign an invalid structured message
         */
        test('Should be NOT able to sign an invalid structured message', async () => {
            // Sign without the 'from' field
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTypedData_v4,
                    params: [THOR_SOLO_SEEDED_ACCOUNTS[0].address]
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should be NOT able to sign the message without the address
         */
        test('Should be NOT able to sign the message without the address', async () => {
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTypedData_v4,
                    params: [
                        {
                            domain: eip712TestCases.valid.domain,
                            types: eip712TestCases.valid.types,
                            message: eip712TestCases.valid.data,
                            primaryType: eip712TestCases.valid.primaryType
                        }
                    ]
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should be NOT able to sign the message with invalid input params
         */
        test('Should be NOT able to sign the message with invalid input params', async () => {
            // Sign with invalid input params
            await expect(
                provider.request({
                    method: RPC_METHODS.eth_signTypedData_v4,
                    params: ['INVALID_PARAMS']
                })
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
