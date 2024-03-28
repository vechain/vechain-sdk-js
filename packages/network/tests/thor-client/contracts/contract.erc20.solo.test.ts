import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type Contract,
    ThorClient,
    type TransactionReceipt
} from '../../../src';
import { soloNetwork, TEST_ACCOUNTS } from '../../fixture';
import { deployedERC20Abi, erc20ContractBytecode } from './fixture';
import { addressUtils } from '@vechain/sdk-core';
import { InvalidAbiFunctionError } from '@vechain/sdk-errors';
import { PrivateKeySigner } from '@vechain/sdk-wallet/src/signers';

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
    let pkSigner: PrivateKeySigner;

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
        pkSigner = new PrivateKeySigner(
            thorSoloClient,
            Buffer.from(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                'hex'
            )
        );
    });

    /**
     * Test the deployment of an ERC20 contract using the thorSoloClient.
     */
    test('deployErc20Contract with Contract Factory', async () => {
        // Deploy the ERC20 contract and receive a response
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            pkSigner
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
            pkSigner
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

    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    test('listen to ERC20 contract operations', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            pkSigner
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                1000
            )
        ).wait();

        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                5000
            )
        ).wait();

        const events = await contract.filters
            .Transfer(
                undefined,
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
            )
            .get();

        expect(
            events.map((event) => {
                return event.data;
            })
        ).toEqual([
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
            '0x0000000000000000000000000000000000000000000000000000000000001388'
        ]);

        expect(
            events.map((event) => {
                return event.topics;
            })
        ).toEqual([
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ],
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ]
        ]);
    }, 10000); // Set a timeout of 10000ms for this test

    test('listen to a non existing ERC20 event', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            pkSigner
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        await expect(
            async () => await contract.filters.EventNotFound().get()
        ).rejects.toThrowError(InvalidAbiFunctionError);
    }, 10000);

    /**
     * Test listening to a non-existing ERC20 event.
     */
    test('listen to a non existing ERC20 event', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            pkSigner
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        await expect(
            async () => await contract.filters.EventNotFound().get()
        ).rejects.toThrowError(InvalidAbiFunctionError);
    }, 10000);
});
