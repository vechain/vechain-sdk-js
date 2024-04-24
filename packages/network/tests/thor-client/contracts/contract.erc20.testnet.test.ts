import { beforeEach, describe, expect, test } from '@jest/globals';
import { type Contract, ThorClient } from '../../../src';
import { TEST_ACCOUNTS, testnetUrl } from '../../fixture';
import {
    TESTNET_DELEGATE_URL,
    deployedERC20Abi,
    erc20ContractBytecode
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

    beforeEach(() => {
        thorTestnetClient = ThorClient.fromUrl(testnetUrl);
    });

    /**
     * Test transaction  execution with url delegation set from contract.
     */
    test('transaction execution with url delegation set from contract', async () => {
        // Deploy the ERC20 contract
        let factory = thorTestnetClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
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
