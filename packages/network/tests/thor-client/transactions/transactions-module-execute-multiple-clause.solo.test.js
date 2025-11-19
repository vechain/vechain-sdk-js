"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the executeMultipleClausesTransaction method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module Execute multiple clauses', () => {
    let thorSoloClient;
    let accountDispatcher;
    let provider;
    let signer;
    let wallet;
    const testContractABI = sdk_core_1.ABIContract.ofAbi((0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ABI);
    const testContractAddress = (0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ADDRESS;
    const depositFn = testContractABI.getFunction('deposit');
    const clauses = [
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
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        accountDispatcher = sdk_solo_setup_1.AccountDispatcher.getInstance();
        wallet = new src_1.ProviderInternalBaseWallet([
            {
                address: accountDispatcher.getNextAccount().address,
                privateKey: sdk_core_1.Hex.of(accountDispatcher.getNextAccount().privateKey).bytes
            }
        ]);
        provider = new src_1.VeChainProvider(thorSoloClient, wallet);
        signer = (await provider.getSigner());
    });
    (0, globals_1.test)('ok <- Execute legacy transaction for testing contract', async () => {
        // setup options
        const options = {
            gas: 1000000,
            gasPriceCoef: 0
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeMultipleClausesTransaction(clauses, signer, options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 30000);
    (0, globals_1.test)('ok <- Execute EIP-1559 transaction for testing contract', async () => {
        // setup options
        const options = {
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeMultipleClausesTransaction(clauses, signer, options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 30000);
    (0, globals_1.test)('ok <- Execute EIP-1559 transaction using clauses built with transferVTHOToken', async () => {
        // setup options
        const options = {
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        const vthoTransferClauses = [
            sdk_core_1.Clause.transferVTHOToken(sdk_core_1.Address.of(testContractAddress), sdk_core_1.VTHO.of(100, sdk_core_1.Units.wei)),
            sdk_core_1.Clause.transferVTHOToken(sdk_core_1.Address.of(testContractAddress), sdk_core_1.VTHO.of(200, sdk_core_1.Units.wei))
        ];
        // execute the transaction
        const tx = await thorSoloClient.transactions.executeMultipleClausesTransaction(vthoTransferClauses, signer, options);
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    });
    (0, globals_1.test)('ok <- Execute transaction for testing contract that defaults to EIP-1559', async () => {
        // setup options
        const options = {
            gas: 1000000
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeMultipleClausesTransaction(clauses, signer, options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 30000);
    (0, globals_1.test)('ok <- Execute transaction for testing contract with legacy and EIP-1559 options (will use legacy fee type)', async () => {
        // setup options
        const options = {
            gas: 1000000,
            gasPriceCoef: 0,
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeMultipleClausesTransaction(clauses, signer, options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 30000);
});
