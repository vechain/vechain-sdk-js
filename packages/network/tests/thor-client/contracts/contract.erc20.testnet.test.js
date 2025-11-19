"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const fixture_2 = require("./fixture");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Tests for the ThorClient class, specifically focusing on ERC20 contract-related functionality.
 *
 * @group integration/client/thor-client/contracts/erc20
 */
(0, globals_1.describe)('ThorClient - ERC20 Contracts on testnet', () => {
    // ThorClient instance
    let thorTestnetClient;
    let providerWithDelegationEnabled;
    (0, globals_1.beforeEach)(() => {
        thorTestnetClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        // Create the provider (used in this case to sign the transaction with getSigner() method)
        providerWithDelegationEnabled = new src_1.VeChainProvider(
        // Thor client used by the provider
        thorTestnetClient, 
        // Internal wallet used by the provider (needed to call the getSigner() method)
        new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                    .privateKey).bytes,
                address: fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            }
        ], {
            gasPayer: {
                gasPayerServiceUrl: fixture_2.TESTNET_DELEGATE_URL
            }
        }), 
        // Enable fee delegation
        true);
    });
    /**
     * Test transaction  execution with url delegation set from contract.
     */
    (0, globals_1.test)('transaction execution with url delegation set from contract', async () => {
        const contract = thorTestnetClient.contracts.load(fixture_2.ERC20_CONTRACT_ADDRESS_ON_TESTNET, sdk_core_1.ERC20_ABI, (await providerWithDelegationEnabled.getSigner(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address)));
        const txResult = await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 1000n)).wait();
        (0, globals_1.expect)(txResult?.reverted).toBe(false);
    }, 30000);
    /**
     * Test transaction with url delegation per transaction.
     */
    (0, globals_1.test)('transaction with url delegation per transaction', async () => {
        const txResult = await thorTestnetClient.contracts.executeTransaction((await providerWithDelegationEnabled.getSigner(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address)), fixture_2.ERC20_CONTRACT_ADDRESS_ON_TESTNET, sdk_core_1.ABIContract.ofAbi(sdk_core_1.ERC20_ABI).getFunction('transfer'), [fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 1000n], {
            comment: 'test comment',
            delegationUrl: fixture_2.TESTNET_DELEGATE_URL
        });
        const result = (await txResult.wait());
        (0, globals_1.expect)(result.reverted).toBeFalsy();
        (0, globals_1.expect)(result.gasPayer).not.toBe(result.meta.txOrigin);
    }, 30000);
});
