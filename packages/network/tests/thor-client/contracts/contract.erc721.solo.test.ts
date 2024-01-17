// Global variable to hold contract address
import { erc721ContractBytecode, erc721ContractTestCases } from './fixture';
import { expect, test, beforeAll, describe, afterAll } from '@jest/globals';
import { ThorClient, type TransactionReceipt } from '../../../src';
import { soloNetwork, TEST_ACCOUNTS } from '../../fixture';
import { coder, ERC721_ABI, type Log } from '@vechain/vechain-sdk-core';

/**
 * Tests for the ERC721 Contract, specifically focusing on NFT contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts/erc721
 */
describe('ThorClient - ERC721 Contracts', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    let contractAddress: string;

    /**
     * Test the deployment of an ERC721 contract using the thorSoloClient.
     *
     * This test simulates the deployment of an ERC721 smart contract to a blockchain network
     * using the thorSoloClient's deployContract method. It follows these steps:
     * 1. Deploys the ERC721 contract with the given bytecode using the private key of
     *    the contract manager from TEST_ACCOUNTS.
     * 2. Waits for the transaction to complete using the thorSoloClient's waitForTransaction
     *    method, and then retrieves the transaction receipt.
     * 3. Extracts the contract address from the transaction receipt's outputs.
     *
     * The test asserts that the contract address is defined, ensuring that the contract
     * deployment is successful and the address is correctly retrieved.
     *
     * @remarks
     * The test has a timeout of 10000 milliseconds to account for the potential delay in
     * blockchain transaction processing.
     */
    beforeAll(async () => {
        thorSoloClient = new ThorClient(soloNetwork);

        // Deploy the ERC721 contract and set the contract address
        const response = await thorSoloClient.contracts.deployContract(
            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
            erc721ContractBytecode
        );

        const transactionReceiptDeployContract =
            await thorSoloClient.transactions.waitForTransaction(response.id);

        expect(transactionReceiptDeployContract).toBeDefined();
        expect(
            transactionReceiptDeployContract?.outputs[0].contractAddress
        ).toBeDefined();

        contractAddress = transactionReceiptDeployContract?.outputs[0]
            .contractAddress as string;

        expect(contractAddress).toBeDefined();
    }, 10000);

    afterAll(() => {
        thorSoloClient.destroy();
    });

    erc721ContractTestCases.forEach(
        ({ description, functionName, params, expected, isReadOnly }) => {
            test(description, async () => {
                let response;
                if (isReadOnly) {
                    response =
                        await thorSoloClient.contracts.executeContractCall(
                            contractAddress,
                            ERC721_ABI,
                            functionName,
                            params
                        );
                    expect(response).toBeDefined();
                    expect(response).toEqual(expected);
                } else {
                    response =
                        await thorSoloClient.contracts.executeContractTransaction(
                            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER
                                .privateKey,
                            contractAddress,
                            ERC721_ABI,
                            functionName,
                            params
                        );

                    const result =
                        await thorSoloClient.transactions.waitForTransaction(
                            response.id
                        );

                    expect(result).toBeDefined();
                    expect(result?.outputs).toBeDefined();

                    const logDescriptions = decodeResultOutput(
                        result as TransactionReceipt
                    );

                    expect(logDescriptions[0][0]?.args).toEqual(expected);
                }
            });
        }
    );

    function decodeResultOutput(
        result: TransactionReceipt
    ): Array<Array<Log | null>> {
        return result?.outputs.map((output) => {
            return output.events.map((event) => {
                return coder.parseLog(ERC721_ABI, event.data, event.topics);
            });
        });
    }
});
