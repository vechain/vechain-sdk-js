import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type Contract,
    ThorClient,
    VechainBaseSigner,
    VechainProvider,
    type VechainSigner
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

    // Signer instance
    let signer: VechainSigner;

    beforeEach(() => {
        thorTestnetClient = ThorClient.fromUrl(testnetUrl);
        signer = new VechainBaseSigner(
            Buffer.from(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                'hex'
            ),
            new VechainProvider(thorTestnetClient)
        );
    });

    /**
     * Test transaction  execution with url delegation set from contract.
     */
    test('transaction execution with url delegation set from contract', async () => {
        const contract: Contract = thorTestnetClient.contracts.load(
            ERC20_CONTRACT_ADDRESS_ON_TESTNET,
            deployedERC20Abi,
            signer
        );

        const txResult = await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                1000,
                {
                    delegatorUrl: TESTNET_DELEGATE_URL
                }
            )
        ).wait();

        expect(txResult?.reverted).toBe(false);
    }, 30000);
});
