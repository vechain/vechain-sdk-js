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
    erc20ContractBytecode,
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
        // Deploy the ERC20 contract
        let factory = thorTestnetClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

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

        expect(
            await contract.read.balanceOf(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address
            )
        ).toEqual([BigInt(1000)]);
    }, 30000);
});
