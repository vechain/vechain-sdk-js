import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    TESTNET_URL,
    ThorClient,
    type TransactionReceipt,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
import { TEST_ACCOUNTS } from '../../fixture';
import {
    ERC20_CONTRACT_ADDRESS_ON_TESTNET,
    TESTNET_DELEGATE_URL
} from './fixture';
import { ABIContract, ERC20_ABI, HexUInt } from '@vechain/sdk-core';

/**
 * Tests for the ThorClient class, specifically focusing on ERC20 contract-related functionality.
 *
 * @group integration/client/thor-client/contracts/erc20
 */
describe('ThorClient - ERC20 Contracts on testnet', () => {
    // ThorClient instance
    let thorTestnetClient: ThorClient;
    let providerWithDelegationEnabled: VeChainProvider;

    beforeEach(() => {
        thorTestnetClient = ThorClient.at(TESTNET_URL);
        // Create the provider (used in this case to sign the transaction with getSigner() method)
        providerWithDelegationEnabled = new VeChainProvider(
            // Thor client used by the provider
            thorTestnetClient,

            // Internal wallet used by the provider (needed to call the getSigner() method)
            new ProviderInternalBaseWallet(
                [
                    {
                        privateKey: HexUInt.of(
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey
                        ).bytes,
                        address:
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                    }
                ],
                {
                    gasPayer: {
                        gasPayerServiceUrl: TESTNET_DELEGATE_URL
                    }
                }
            ),

            // Enable fee delegation
            true
        );
    });

    /**
     * Test transaction  execution with url delegation set from contract.
     */
    test('transaction execution with url delegation set from contract', async () => {
        const contract = thorTestnetClient.contracts.load(
            ERC20_CONTRACT_ADDRESS_ON_TESTNET,
            ERC20_ABI,
            (await providerWithDelegationEnabled.getSigner(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )) as VeChainSigner
        );

        const txResult = await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                1000n
            )
        ).wait();

        expect(txResult?.reverted).toBe(false);
    }, 30000);

    /**
     * Test transaction with url delegation per transaction.
     */
    test('transaction with url delegation per transaction', async () => {
        const txResult = await thorTestnetClient.contracts.executeTransaction(
            (await providerWithDelegationEnabled.getSigner(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )) as VeChainSigner,
            ERC20_CONTRACT_ADDRESS_ON_TESTNET,
            ABIContract.ofAbi(ERC20_ABI).getFunction('transfer'),
            [TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address, 1000n],
            {
                comment: 'test comment',
                delegationUrl: TESTNET_DELEGATE_URL
            }
        );

        const result = (await txResult.wait()) as TransactionReceipt;

        expect(result.reverted).toBeFalsy();
        expect(result.gasPayer).not.toBe(result.meta.txOrigin);
    }, 30000);
});
