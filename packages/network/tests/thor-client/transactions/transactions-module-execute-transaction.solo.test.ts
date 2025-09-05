import { describe, expect, test } from '@jest/globals';
import {
    type ContractTransactionOptions,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
import { HttpMethod, type HttpParams } from '../../../src/http';
import { ABIContract, Hex } from '@vechain/sdk-core';
import { AccountDispatcher, getConfigData } from '@vechain/sdk-solo-setup';
import { retryOperation } from '../../test-utils';

/**
 * Tests for the executeTransaction method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module Execute Transaction', () => {
    let thorSoloClient: ThorClient;
    let accountDispatcher: AccountDispatcher;
    let provider: VeChainProvider;
    let signer: VeChainSigner;
    let wallet: ProviderInternalBaseWallet;

    const testContractABI = ABIContract.ofAbi(
        getConfigData().TESTING_CONTRACT_ABI
    );
    const testContractAddress = getConfigData().TESTING_CONTRACT_ADDRESS;
    const depositFn = testContractABI.getFunction('deposit');

    beforeAll(async () => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
        accountDispatcher = AccountDispatcher.getInstance();
        wallet = new ProviderInternalBaseWallet([
            {
                address: accountDispatcher.getNextAccount().address,
                privateKey: Hex.of(
                    accountDispatcher.getNextAccount().privateKey
                ).bytes
            }
        ]);
        provider = new VeChainProvider(thorSoloClient, wallet);
        signer = (await provider.getSigner()) as VeChainSigner;
    });

    test('ok <- Execute legacy transaction for testing contract', async () => {
        // setup options
        const options: ContractTransactionOptions = {
            gas: 1000000,
            gasPriceCoef: 0
        };
        // execute the transaction with retry logic
        const tx = await retryOperation(
            async () =>
                await thorSoloClient.transactions.executeTransaction(
                    signer, // signer is checked for null in beforeAll
                    testContractAddress,
                    depositFn,
                    [1],
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 15000);

    test('ok <- Execute EIP-1559 transaction for testing contract', async () => {
        // setup options
        const options: ContractTransactionOptions = {
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await retryOperation(
            async () =>
                await thorSoloClient.transactions.executeTransaction(
                    signer,
                    testContractAddress,
                    depositFn,
                    [1],
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 15000);

    test('ok <- Execute transaction for testing contract that defaults to EIP-1559', async () => {
        // setup options
        const options: ContractTransactionOptions = {
            gas: 1000000
        };
        // execute the transaction with retry logic
        const tx = await retryOperation(
            async () =>
                await thorSoloClient.transactions.executeTransaction(
                    signer,
                    testContractAddress,
                    depositFn,
                    [1],
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 15000);

    test('ok <- Execute transaction for testing contract with legacy and EIP-1559 options (will use legacy fee type)', async () => {
        // setup options
        const options: ContractTransactionOptions = {
            gas: 1000000,
            gasPriceCoef: 0,
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await retryOperation(
            async () =>
                await thorSoloClient.transactions.executeTransaction(
                    signer,
                    testContractAddress,
                    depositFn,
                    [1],
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 15000);

    // Tests for the fix that prevents "Maximum call stack size exceeded" error
    test('Should handle polling timeout gracefully with safety limit', async () => {
        const originalHttpClient = thorSoloClient.httpClient;
        const mockHttpClient = {
            ...originalHttpClient,
            http: async (
                _method: HttpMethod,
                _path: string,
                _params?: HttpParams
            ): Promise<unknown> => {
                await new Promise((resolve) => setTimeout(resolve, 0));
                throw new Error('Network timeout error');
            }
        };
        (thorSoloClient as { httpClient: typeof mockHttpClient }).httpClient =
            mockHttpClient;

        try {
            const startTime = Date.now();
            const receipt =
                await thorSoloClient.transactions.waitForTransaction(
                    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                    { timeoutMs: 5000 }
                );
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(10000); // Should not take more than 10 seconds
            expect(receipt).toBeNull();
        } catch (error) {
            expect(error).not.toBeInstanceOf(RangeError);
            expect((error as Error).message).not.toContain(
                'Maximum call stack size exceeded'
            );
        } finally {
            (
                thorSoloClient as { httpClient: typeof originalHttpClient }
            ).httpClient = originalHttpClient;
        }
    }, 15000);

    test('Should handle network errors gracefully in getTransactionReceipt', async () => {
        const originalHttpClient = thorSoloClient.httpClient;
        const mockHttpClient = {
            ...originalHttpClient,
            http: async (
                _method: HttpMethod,
                _path: string,
                _params?: HttpParams
            ): Promise<unknown> => {
                await new Promise((resolve) => setTimeout(resolve, 0));
                throw new Error('Network connection reset');
            }
        };
        (thorSoloClient as { httpClient: typeof mockHttpClient }).httpClient =
            mockHttpClient;

        try {
            const receipt =
                await thorSoloClient.transactions.getTransactionReceipt(
                    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
                );
            expect(receipt).toBeNull();
        } finally {
            (
                thorSoloClient as { httpClient: typeof originalHttpClient }
            ).httpClient = originalHttpClient;
        }
    });

    test('Should demonstrate fix prevents infinite polling loops', async () => {
        const originalHttpClient = thorSoloClient.httpClient;
        let callCount = 0;
        const mockHttpClient = {
            ...originalHttpClient,
            http: async (
                method: HttpMethod,
                path: string,
                params?: HttpParams
            ): Promise<unknown> => {
                callCount++;
                if (callCount < 50) {
                    throw new Error(
                        'Network timeout error - Thor temporarily unavailable'
                    );
                }
                return originalHttpClient.http(method, path, params);
            }
        };
        (thorSoloClient as { httpClient: typeof mockHttpClient }).httpClient =
            mockHttpClient;

        try {
            const startTime = Date.now();
            await thorSoloClient.transactions.waitForTransaction(
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                { timeoutMs: 10000 }
            );
            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(15000); // Should not take more than 15 seconds
            expect(callCount).toBeGreaterThan(0);
        } catch (error) {
            expect(error).not.toBeInstanceOf(RangeError);
            expect((error as Error).message).not.toContain(
                'Maximum call stack size exceeded'
            );
        } finally {
            (
                thorSoloClient as { httpClient: typeof originalHttpClient }
            ).httpClient = originalHttpClient;
        }
    }, 20000);
});
