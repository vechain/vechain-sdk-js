import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    TESTNET_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
import { TEST_ACCOUNTS } from '../../fixture';
import {
    ERC20_CONTRACT_ADDRESS_ON_TESTNET,
    TESTNET_DELEGATE_URL
} from './fixture';
import { ERC20_ABI, HexUInt } from '@vechain/sdk-core';

/**
 * Tests for the ThorClient class, specifically focusing on ERC20 contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
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
                    delegator: {
                        delegatorUrl: TESTNET_DELEGATE_URL
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
});
