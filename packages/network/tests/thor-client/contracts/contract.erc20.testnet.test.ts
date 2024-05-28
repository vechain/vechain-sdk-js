import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type Contract,
    ProviderInternalBaseWallet,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '../../../src';
import { TEST_ACCOUNTS, testnetUrl } from '../../fixture';
import {
    deployedERC20Abi,
    ERC20_CONTRACT_ADDRESS_ON_TESTNET,
    TESTNET_DELEGATE_URL
} from './fixture';

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
        thorTestnetClient = ThorClient.fromUrl(testnetUrl);
        // Create the provider (used in this case to sign the transaction with getSigner() method)
        providerWithDelegationEnabled = new VeChainProvider(
            // Thor client used by the provider
            thorTestnetClient,

            // Internal wallet used by the provider (needed to call the getSigner() method)
            new ProviderInternalBaseWallet(
                [
                    {
                        privateKey: Buffer.from(
                            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey,
                            'hex'
                        ),
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
        const contract: Contract = thorTestnetClient.contracts.load(
            ERC20_CONTRACT_ADDRESS_ON_TESTNET,
            deployedERC20Abi,
            (await providerWithDelegationEnabled.getSigner(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )) as VeChainSigner
        );

        const txResult = await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                1000
            )
        ).wait();

        expect(txResult?.reverted).toBe(false);
    }, 30000);
});
