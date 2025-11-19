"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const fixture_2 = require("./fixture");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the ThorClient class, specifically focusing on ERC20 contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts/erc20
 */
(0, globals_1.describe)('ThorClient - ERC20 Contracts', () => {
    // ThorClient instance
    let thorSoloClient;
    // Signer instance
    let signer;
    let providerWithDelegationPrivateKeyEnabled;
    (0, globals_1.beforeEach)(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey).bytes, new src_1.VeChainProvider(thorSoloClient));
        // Create the provider (used in this case to sign the transaction with getSigner() method)
        providerWithDelegationPrivateKeyEnabled = new src_1.VeChainProvider(
        // Thor client used by the provider
        thorSoloClient, 
        // Internal wallet used by the provider (needed to call the getSigner() method)
        new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER
                    .privateKey).bytes,
                address: fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address
            }
        ], {
            gasPayer: {
                gasPayerPrivateKey: fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey
            }
        }), 
        // Enable fee delegation
        true);
    });
    /**
     * Test the deployment of an ERC20 contract using the thorSoloClient.
     */
    (0, globals_1.test)('deployErc20Contract with Contract Factory', async () => {
        // Deploy the ERC20 contract and receive a response
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        (0, globals_1.expect)(factory.getDeployTransaction()).not.toBe(undefined);
        const contract = await factory.waitForDeployment();
        (0, globals_1.expect)(contract.address).not.toBe(null);
        (0, globals_1.expect)(sdk_core_1.Address.isValid(contract.address)).toBe(true);
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
    (0, globals_1.test)('Execute ERC20 contract operations', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n);
        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer = (await transferResult.wait());
        // Verify that the transfer transaction did not revert
        (0, globals_1.expect)(transactionReceiptTransfer.reverted).toBe(false);
        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult = await contract.read.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address);
        // Ensure that the transfer transaction was successful and the balance is as expected
        (0, globals_1.expect)(transactionReceiptTransfer.reverted).toBe(false);
        (0, globals_1.expect)(balanceOfResult).toEqual([1000n]);
    }, 10000); // Set a timeout of 10000ms for this test
    (0, globals_1.test)('Execute ERC20 contract operations with comments', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer({ value: 0, comment: 'Transfer 1000 tokens' }, fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n);
        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer = (await transferResult.wait());
        // Verify that the transfer transaction did not revert
        (0, globals_1.expect)(transactionReceiptTransfer.reverted).toBe(false);
        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult = await contract.read.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address);
        // Ensure that the transfer transaction was successful and the balance is as expected
        (0, globals_1.expect)(transactionReceiptTransfer.reverted).toBe(false);
        (0, globals_1.expect)(balanceOfResult).toEqual([1000n]);
    }, 10000); // Set a timeout of 10000ms for this test
    (0, globals_1.test)('Execute ERC20 contract operations with revision', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult = await contract.transact.transfer({ value: 0, revision: 'best' }, fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n);
        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer = (await transferResult.wait());
        // Verify that the transfer transaction did not revert
        (0, globals_1.expect)(transactionReceiptTransfer.reverted).toBe(false);
        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult = await contract.read.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address);
        // Ensure that the transfer transaction was successful and the balance is as expected
        (0, globals_1.expect)(transactionReceiptTransfer.reverted).toBe(false);
        (0, globals_1.expect)(balanceOfResult).toEqual([1000n]);
    }, 10000);
    /**
     * Test transaction execution with delegation.
     */
    (0, globals_1.test)('transaction execution with delegation', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        contract.setContractTransactOptions({
            signTransactionOptions: {
                gasPayerPrivateKey: fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey
            },
            isDelegated: true
        });
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 1000n)).wait();
    }, 10000);
    /**
     * Test transaction execution with delegation set from contract.
     */
    (0, globals_1.test)('transaction execution with delegation set from contract', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, (await providerWithDelegationPrivateKeyEnabled.getSigner(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address)));
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        const txResult = await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 1000n)).wait();
        (0, globals_1.expect)(txResult?.reverted).toBe(false);
        (0, globals_1.expect)(await contract.read.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address)).toEqual([1000n]);
    }, 10000);
    /**
     * Tests the execution of multiple ERC20 contract read clauses using a blockchain client.
     */
    (0, globals_1.test)('Execute multiple ERC20 read contract clauses', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        const contractRead = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.contracts.executeMultipleClausesCall([
            contract.clause.name(),
            contract.clause.symbol(),
            contract.clause.decimals()
        ]));
        (0, globals_1.expect)(contractRead[0]).toEqual({
            success: true,
            result: {
                plain: 'SampleToken',
                array: ['SampleToken']
            }
        });
        (0, globals_1.expect)(contractRead[1]).toEqual({
            success: true,
            result: {
                plain: 'ST',
                array: ['ST']
            }
        });
        (0, globals_1.expect)(contractRead[2]).toEqual({
            success: true,
            result: {
                plain: 18,
                array: [18]
            }
        });
    }, 10000);
    /**
     * Tests the execution of multiple ERC20 reverted read clauses.
     */
    (0, globals_1.test)('Execute multiple ERC20 read contract clauses that reverts', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        const contractRead = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.contracts.executeMultipleClausesCall([
            contract.clause.name(),
            contract.clause.symbol(),
            contract.clause.decimals()
        ]));
        (0, globals_1.expect)(contractRead[0]).toEqual({
            success: true,
            result: {
                plain: 'SampleToken',
                array: ['SampleToken']
            }
        });
        (0, globals_1.expect)(contractRead[1]).toEqual({
            success: true,
            result: {
                plain: 'ST',
                array: ['ST']
            }
        });
        (0, globals_1.expect)(contractRead[2]).toEqual({
            success: true,
            result: {
                plain: 18,
                array: [18]
            }
        });
    }, 10000);
    /**
     * Tests the execution of multiple ERC20 contract clauses using a blockchain client. Once using a TransactionClause[] and once using a ContractClause[]
     */
    ['TransactionClause', 'ContractClause'].forEach((testCase) => {
        (0, globals_1.test)('Execute multiple ERC20 contract clauses', async () => {
            // Deploy the ERC20 contract
            let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
            factory = await factory.startDeployment();
            const contract = await factory.waitForDeployment();
            const rawClauses = [
                contract.clause.transfer({ comment: 'Transfer 1000 tokens' }, fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n),
                contract.clause.transfer({ comment: 'Transfer 1000 tokens' }, fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 1000n),
                contract.clause.transfer({ comment: 'Transfer 3000 tokens' }, fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 3000n)
            ];
            // Execute multiple 'transfer' transactions on the deployed contract,
            const txResult = await thorSoloClient.contracts.executeMultipleClausesTransaction(testCase === 'ContractClause'
                ? rawClauses
                : rawClauses.map((clause) => clause.clause), signer);
            await txResult.wait();
            const reads = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.contracts.executeMultipleClausesCall([
                contract.clause.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                    .address),
                contract.clause.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address)
            ]));
            (0, globals_1.expect)(reads[0]).toEqual({
                success: true,
                result: {
                    plain: 1000n,
                    array: [1000n]
                }
            });
            (0, globals_1.expect)(reads[1]).toEqual({
                success: true,
                result: {
                    plain: 4000n,
                    array: [4000n]
                }
            });
        }, 10000);
    });
    /**
     * Test transaction execution with url delegation set from contract.
     */
    (0, globals_1.test)('transaction execution with private key delegation', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, (await providerWithDelegationPrivateKeyEnabled.getSigner(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address)));
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        const txResult = await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 1000n)).wait();
        (0, globals_1.expect)(txResult?.reverted).toBe(false);
        (0, globals_1.expect)(await contract.read.balanceOf(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address)).toEqual([1000n]);
    }, 30000);
});
