import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    THOR_SOLO_URL,
    ThorClient,
    type TransactionReceipt,
    VeChainPrivateKeySigner,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
import { TEST_ACCOUNTS } from '../../fixture';
import { erc20ContractBytecode } from './fixture';
import { addressUtils, ERC20_ABI } from '@vechain/sdk-core';

/**
 * Tests for the ThorClient class, specifically focusing on ERC20 contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts/erc20
 */
describe('ThorClient - ERC20 Contracts', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    // Signer instance
    let signer: VeChainSigner;

    let providerWithDelegationPrivateKeyEnabled: VeChainProvider;

    beforeEach(() => {
        thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);
        signer = new VeChainPrivateKeySigner(
            Buffer.from(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                'hex'
            ),
            new VeChainProvider(thorSoloClient)
        );

        // Create the provider (used in this case to sign the transaction with getSigner() method)
        providerWithDelegationPrivateKeyEnabled = new VeChainProvider(
            // Thor client used by the provider
            thorSoloClient,

            // Internal wallet used by the provider (needed to call the getSigner() method)
            new ProviderInternalBaseWallet(
                [
                    {
                        privateKey: Buffer.from(
                            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER
                                .privateKey,
                            'hex'
                        ),
                        address:
                            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address
                    }
                ],
                {
                    delegator: {
                        delegatorPrivateKey:
                            TEST_ACCOUNTS.TRANSACTION.DELEGATOR.privateKey
                    }
                }
            ),

            // Enable fee delegation
            true
        );
    });

    /**
     * Test the deployment of an ERC20 contract using the thorSoloClient.
     */
    test('deployErc20Contract with Contract Factory', async () => {
        // Deploy the ERC20 contract and receive a response
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        expect(factory.getDeployTransaction()).not.toBe(undefined);

        const contract = await factory.waitForDeployment();

        expect(contract.address).not.toBe(null);
        expect(addressUtils.isAddress(contract.address)).toBe(true);
    }, 10000);

    /**
     * Tests the execution of ERC20 contract operations using a blockchain client.
     *
     * This test covers the deployment of an ERC20 token contract, executing a transfer transaction,
     * and verifying the transaction's effects. It begins by deploying the contract and obtaining
     * its address. A transfer operation is then executed to transfer tokens to a specified address.
     * Finally, the test verifies that the transaction was successful and that the recipient's balance
     * reflects the transferred amount.
     *
     */
    test('Execute ERC20 contract operations', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            1000n
        );

        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer =
            (await transferResult.wait()) as TransactionReceipt;

        // Verify that the transfer transaction did not revert
        expect(transactionReceiptTransfer.reverted).toBe(false);

        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult = await contract.read.balanceOf(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        );

        // Ensure that the transfer transaction was successful and the balance is as expected
        expect(transactionReceiptTransfer.reverted).toBe(false);
        expect(balanceOfResult).toEqual([BigInt(1000)]);
    }, 10000); // Set a timeout of 10000ms for this test

    test('Execute ERC20 contract operations with comments', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer(
            { value: 0, comment: 'Transfer 1000 tokens' },
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            1000n
        );

        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer =
            (await transferResult.wait()) as TransactionReceipt;

        // Verify that the transfer transaction did not revert
        expect(transactionReceiptTransfer.reverted).toBe(false);

        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult = await contract.read.balanceOf(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        );

        // Ensure that the transfer transaction was successful and the balance is as expected
        expect(transactionReceiptTransfer.reverted).toBe(false);
        expect(balanceOfResult).toEqual([BigInt(1000)]);
    }, 10000); // Set a timeout of 10000ms for this test

    test('Execute ERC20 contract operations with revision', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer(
            { value: 0, revision: 'best' },
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            1000n
        );

        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer =
            (await transferResult.wait()) as TransactionReceipt;

        // Verify that the transfer transaction did not revert
        expect(transactionReceiptTransfer.reverted).toBe(false);

        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult = await contract.read.balanceOf(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        );

        // Ensure that the transfer transaction was successful and the balance is as expected
        expect(transactionReceiptTransfer.reverted).toBe(false);
        expect(balanceOfResult).toEqual([BigInt(1000)]);
    }, 10000);

    /**
     * Test transaction execution with delegation.
     */
    test('transaction execution with delegation', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        contract.setContractTransactOptions({
            signTransactionOptions: {
                delegatorPrivateKey:
                    TEST_ACCOUNTS.TRANSACTION.DELEGATOR.privateKey
            },
            isDelegated: true
        });

        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                1000n
            )
        ).wait();
    }, 10000);

    /**
     * Test transaction execution with delegation set from contract.
     */
    test('transaction execution with delegation set from contract', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            (await providerWithDelegationPrivateKeyEnabled.getSigner(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address
            )) as VeChainSigner
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        const txResult = await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                1000n
            )
        ).wait();

        expect(txResult?.reverted).toBe(false);

        expect(
            await contract.read.balanceOf(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address
            )
        ).toEqual([BigInt(1000)]);
    }, 10000);

    /**
     * Tests the execution of multiple ERC20 contract read clauses using a blockchain client.
     */
    test('Execute multiple ERC20 read contract clauses', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        const contractRead =
            await thorSoloClient.contracts.executeMultipleClausesCall([
                contract.clause.name(),
                contract.clause.symbol(),
                contract.clause.decimals()
            ]);

        expect(contractRead[0]).toEqual(['SampleToken']);
        expect(contractRead[1]).toEqual(['ST']);
        expect(contractRead[2]).toEqual([BigInt(18)]);
    }, 10000);

    /**
     * Tests the execution of multiple ERC20 reverted read clauses.
     */
    test('Execute multiple ERC20 read contract clauses that reverts', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        const contractRead =
            await thorSoloClient.contracts.executeMultipleClausesCall([
                contract.clause.name(),
                contract.clause.symbol(),
                contract.clause.decimals()
            ]);

        expect(contractRead[0]).toEqual(['SampleToken']);
        expect(contractRead[1]).toEqual(['ST']);
        expect(contractRead[2]).toEqual([BigInt(18)]);
    }, 10000);

    /**
     * Tests the execution of multiple ERC20 contract clauses using a blockchain client.
     */
    test('Execute multiple ERC20 contract clauses', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        // Execute multiple 'transfer' transactions on the deployed contract,
        const txResult =
            await thorSoloClient.contracts.executeMultipleClausesTransaction(
                [
                    contract.clause.transfer(
                        { comment: 'Transfer 1000 tokens' },
                        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                        1000n
                    ),
                    contract.clause.transfer(
                        { comment: 'Transfer 1000 tokens' },
                        TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                        1000n
                    ),
                    contract.clause.transfer(
                        { comment: 'Transfer 3000 tokens' },
                        TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                        3000n
                    )
                ],
                signer
            );

        await txResult.wait();

        const reads = await thorSoloClient.contracts.executeMultipleClausesCall(
            [
                contract.clause.balanceOf(
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
                ),
                contract.clause.balanceOf(
                    TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address
                )
            ]
        );

        expect(reads[0]).toEqual([BigInt(1000)]);

        expect(reads[1]).toEqual([BigInt(4000)]);
    }, 10000);

    /**
     * Test transaction execution with url delegation set from contract.
     */
    test('transaction execution with private key delegation', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            ERC20_ABI,
            erc20ContractBytecode,
            (await providerWithDelegationPrivateKeyEnabled.getSigner(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address
            )) as VeChainSigner
        );

        factory = await factory.startDeployment();

        const contract = await factory.waitForDeployment();

        const txResult = await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                1000n
            )
        ).wait();

        expect(txResult?.reverted).toBe(false);

        expect(
            await contract.read.balanceOf(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address
            )
        ).toEqual([BigInt(1000)]);
    }, 30000);
});
