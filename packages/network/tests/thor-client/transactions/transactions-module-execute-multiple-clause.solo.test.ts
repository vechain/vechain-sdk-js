import { describe, expect, test } from '@jest/globals';
import {
    type ContractTransactionOptions,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
import {
    ABIContract,
    Address,
    Clause,
    Hex,
    VTHO,
    Units,
    type ContractClause
} from '@vechain/sdk-core';
import { AccountDispatcher, getConfigData } from '@vechain/sdk-solo-setup';
import { retryOperation } from '../../test-utils';

/**
 * Tests for the executeMultipleClausesTransaction method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module Execute multiple clauses', () => {
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

    const clauses: ContractClause[] = [
        {
            clause: {
                to: testContractAddress,
                data: depositFn.encodeData([1]).toString(),
                value: 0
            },
            functionAbi: depositFn
        },
        {
            clause: {
                to: testContractAddress,
                data: depositFn.encodeData([1]).toString(),
                value: 0
            },
            functionAbi: depositFn
        }
    ];

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
                await thorSoloClient.transactions.executeMultipleClausesTransaction(
                    clauses,
                    signer,
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 30000);

    test('ok <- Execute EIP-1559 transaction for testing contract', async () => {
        // setup options
        const options: ContractTransactionOptions = {
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await retryOperation(
            async () =>
                await thorSoloClient.transactions.executeMultipleClausesTransaction(
                    clauses,
                    signer,
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 30000);

    test('ok <- Execute EIP-1559 transaction using clauses built with transferVTHOToken', async () => {
        // setup options
        const options: ContractTransactionOptions = {
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };

        const vthoTransferClauses = [
            Clause.transferVTHOToken(
                Address.of(testContractAddress),
                VTHO.of(100, Units.wei)
            ),
            Clause.transferVTHOToken(
                Address.of(testContractAddress),
                VTHO.of(200, Units.wei)
            )
        ];
        // execute the transaction
        const tx =
            await thorSoloClient.transactions.executeMultipleClausesTransaction(
                vthoTransferClauses,
                signer,
                options
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
                await thorSoloClient.transactions.executeMultipleClausesTransaction(
                    clauses,
                    signer,
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 30000);

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
                await thorSoloClient.transactions.executeMultipleClausesTransaction(
                    clauses,
                    signer,
                    options
                ),
            5, // maxAttempts
            2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        expect(receipt?.reverted).toBe(false);
    }, 30000);
});
