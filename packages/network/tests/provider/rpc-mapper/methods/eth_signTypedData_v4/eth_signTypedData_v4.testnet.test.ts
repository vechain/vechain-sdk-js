import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import { getUnusedAccount } from '../../../../fixture';
import { Hex, HexUInt, Secp256k1 } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';
import { eip712TestCases } from '../../../../signer/signers/vechain-private-key-signer/fixture';

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
     * The account to use for testing
     */
    let testAccount: ReturnType<typeof getUnusedAccount>;

    /**
     * Wallet address to use for testing
     */
    let walletAddress: string;

    /**
     * Init thor client before each test
     */
    beforeEach(async () => {
        // Get a test account
        testAccount = getUnusedAccount();

        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);

        // Init provider
        // @NOTE: Since we are testing the signature, we can use SOLO accounts with testnet!
        provider = new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([
                {
                    privateKey: HexUInt.of(testAccount.privateKey).bytes,
                    publicKey: Secp256k1.derivePublicKey(
                        HexUInt.of(testAccount.privateKey).bytes
                    ),
                    address: testAccount.address
                }
            ])
        );

        // Verify wallet exists
        expect(provider.wallet).toBeDefined();

        // Get addresses from wallet
        const addresses = await provider.wallet?.getAddresses();
        expect(addresses).toBeDefined();
        expect(addresses?.length).toBeGreaterThan(0);

        // Store the first address for tests
        walletAddress = addresses?.[0] as string;
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
                    walletAddress,
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
                params: [testAccount.address, typedDataString]
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
                        walletAddress,
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
                    params: [testAccount.address, '{invalid json string']
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
                        testAccount.address,
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
                    params: [walletAddress]
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
