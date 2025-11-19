"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Global variable to hold contract address
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const fixture_2 = require("./fixture");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the ERC721 Contract, specifically focusing on NFT contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts/erc721
 */
(0, globals_1.describe)('ThorClient - ERC721 Contracts', () => {
    // ThorClient instance
    let thorSoloClient;
    // Signer instance
    let signer;
    let contractAddress;
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
    (0, globals_1.beforeAll)(async () => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey).bytes, new src_1.VeChainProvider(thorSoloClient));
        // Create the ERC721 contract factory
        const factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC721_ABI, fixture_2.erc721ContractBytecode, signer);
        await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        const transactionReceiptDeployContract = contract.deployTransactionReceipt;
        (0, globals_1.expect)(transactionReceiptDeployContract).toBeDefined();
        (0, globals_1.expect)(transactionReceiptDeployContract?.outputs[0].contractAddress).toBeDefined();
        contractAddress = transactionReceiptDeployContract?.outputs[0]
            .contractAddress;
        (0, globals_1.expect)(contractAddress).toBeDefined();
    }, 10000);
    fixture_2.erc721ContractTestCases.forEach(({ description, functionName, params, expected, isReadOnly }) => {
        (0, globals_1.test)(description, async () => {
            let response;
            if (isReadOnly) {
                response = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.contracts.executeCall(contractAddress, sdk_core_1.ABIContract.ofAbi(sdk_core_1.ERC721_ABI).getFunction(functionName), params));
                (0, globals_1.expect)(response).toBeDefined();
                (0, globals_1.expect)(response).toEqual(expected);
            }
            else {
                response = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.contracts.executeTransaction(signer, contractAddress, sdk_core_1.ABIContract.ofAbi(sdk_core_1.ERC721_ABI).getFunction(functionName), params));
                const result = await response.wait();
                (0, globals_1.expect)(result).toBeDefined();
                (0, globals_1.expect)(result?.outputs).toBeDefined();
                const logDescriptions = decodeResultOutput(result);
                (0, globals_1.expect)(logDescriptions[0][0]).toEqual(expected);
            }
        }, 10000);
    });
    function decodeResultOutput(result) {
        return result?.outputs.map((output) => {
            return output.events.map((event) => {
                return sdk_core_1.ABIContract.ofAbi(sdk_core_1.ERC721_ABI).parseLogAsArray(sdk_core_1.Hex.of(event.data), event.topics.map((topic) => sdk_core_1.Hex.of(topic)));
            });
        });
    }
});
