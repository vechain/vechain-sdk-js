import { describe, expect, test } from '@jest/globals';
import {
    type ContractTransactionOptions,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
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
                )
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    });

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
                )
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    });

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
                )
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    });

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
                )
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    });
});
