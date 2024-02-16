import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type Contract,
    ThorClient,
    type TransactionReceipt
} from '../../../src';
import { soloNetwork, TEST_ACCOUNTS } from '../../fixture';
import { deployedERC20Abi, erc20ContractBytecode } from './fixture';
import { addressUtils } from '@vechain/vechain-sdk-core';

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

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
    });

    /**
     * Test the deployment of an ERC20 contract using the thorSoloClient.
     */
    test('deployErc20Contract with Contract Factory', async () => {
        // Deploy the ERC20 contract and receive a response
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey
        );

        factory = await factory.startDeployment();

        expect(factory.getDeployTransaction()).not.toBe(undefined);

        const contract: Contract = await factory.waitForDeployment();

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
            deployedERC20Abi,
            erc20ContractBytecode,
            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
            1000
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
});
