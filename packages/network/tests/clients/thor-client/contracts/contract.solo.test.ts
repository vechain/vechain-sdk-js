import { describe, expect, test } from '@jest/globals';
import {
    TEST_ACCOUNTS,
    thorestSoloClient,
    thorSoloClient
} from '../../../fixture';
import { contractBytecode, deployedContractBytecode } from './fixture';
import { addressUtils, networkInfo } from '@vechainfoundation/vechain-sdk-core';
import type { TransactionSendResult } from '../../../../src';

/**
 * Tests for the ThorClient class, specifically focusing on contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor/contracts
 */
describe('ThorClient - Contracts', () => {
    /**
     * Test case for deploying a smart contract using the deployContract method.
     */
    test('deployContract', async () => {
        try {
            // Deploy an example contract and get the transaction response
            const response = await deployExampleContract();

            // Poll until the transaction receipt is available
            let transactionReceipt = null;
            while (transactionReceipt == null) {
                transactionReceipt =
                    await thorestSoloClient.transactions.getTransactionReceipt(
                        response.id
                    );
            }

            // Extract the contract address from the transaction receipt
            const contractAddress =
                transactionReceipt.outputs[0].contractAddress;

            // Assertions
            expect(transactionReceipt.reverted).toBe(false);
            expect(transactionReceipt.outputs).toHaveLength(1);
            expect(contractAddress).not.toBeNull();
            expect(addressUtils.isAddress(contractAddress as string)).toBe(
                true
            );
        } catch (error) {
            console.log('error', error);
        }
    }, 200000);

    /**
     * Test case for retrieving the bytecode of a deployed smart contract.
     */
    test('get Contract Bytecode', async () => {
        // Deploy an example contract and get the transaction response
        const response = await deployExampleContract();

        // Poll until the transaction receipt is available
        let transactionReceipt = null;
        while (transactionReceipt == null) {
            transactionReceipt =
                await thorestSoloClient.transactions.getTransactionReceipt(
                    response.id
                );
        }

        // Extract the contract address from the transaction receipt
        const contractAddress = transactionReceipt.outputs[0].contractAddress;

        // Retrieve the bytecode of the deployed contract
        const contractBytecodeResponse =
            await thorSoloClient.contracts.getContractBytecode(
                contractAddress as string
            );

        // Assertion: Compare with the expected deployed contract bytecode
        expect(contractBytecodeResponse).toBe(deployedContractBytecode);
    });

    /**
     * Test case for attempting to retrieve the bytecode of a non-existent contract.
     */
    test('input a wrong contract address', async () => {
        // Attempt to retrieve the bytecode of a non-existent contract
        const contractBytecodeResponse =
            await thorSoloClient.contracts.getContractBytecode(
                '0xa9C0cdEd336699547aaC4f9De5A11Ada979BC59a'
            );

        // Assertion: The response should be '0x' for a non-existent contract
        expect(contractBytecodeResponse).toBe('0x');
    });
});

/**
 * Asynchronous function to deploy an example smart contract.
 *
 * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
 */
async function deployExampleContract(): Promise<TransactionSendResult> {
    // Get the best block information
    const bestBlock = await thorestSoloClient.blocks.getBlock('best');

    // Deploy the contract using the deployContract method
    return await thorSoloClient.contracts.deployContract(
        contractBytecode,
        TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
        {
            chainTag: networkInfo.solo.chainTag,
            blockRef: bestBlock?.id.slice(0, 18)
        }
    );
}
