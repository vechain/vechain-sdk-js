import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type Contract,
    ThorClient,
    VechainBaseSigner,
    VechainProvider,
    type VechainSigner
} from '../../../src';
import { soloUrl, TEST_ACCOUNTS } from '../../fixture';
import { deployedERC20Abi, erc20ContractBytecode } from './fixture';
import { InvalidAbiFunctionError } from '@vechain/sdk-errors';

/**
 * Tests for the ThorClient class, specifically focusing on ERC20 contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts/erc20
 */

describe('ThorClient - ERC20 Contracts', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    // Signer instance
    let signer: VechainSigner;

    beforeEach(() => {
        thorSoloClient = ThorClient.fromUrl(soloUrl);
        signer = new VechainBaseSigner(
            Buffer.from(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                'hex'
            ),
            new VechainProvider(thorSoloClient)
        );
    });

    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    test('listen to ERC20 contract operations', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                1000
            )
        ).wait();

        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                5000
            )
        ).wait();

        const events = await contract.filters
            .Transfer(
                undefined,
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
            )
            .get();

        expect(
            events.map((event) => {
                return event.data;
            })
        ).toEqual([
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
            '0x0000000000000000000000000000000000000000000000000000000000001388'
        ]);

        expect(
            events.map((event) => {
                return event.topics;
            })
        ).toEqual([
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ],
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ]
        ]);
    }, 10000); // Set a timeout of 10000ms for this test

    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    test('listen to ERC20 contract operations building the criterias', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                1000
            )
        ).wait();

        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                5000
            )
        ).wait();

        const transferCriteria = contract.criteria.Transfer(
            undefined,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        );

        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria]
        });

        expect(
            events.map((event) => {
                return event.data;
            })
        ).toEqual([
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
            '0x0000000000000000000000000000000000000000000000000000000000001388'
        ]);

        expect(
            events.map((event) => {
                return event.topics;
            })
        ).toEqual([
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ],
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ]
        ]);
    }, 10000); // Set a timeout of 10000ms for this test

    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    test('listen to ERC20 contract operations with multiple criterias', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                1000
            )
        ).wait();

        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address,
                5000
            )
        ).wait();

        await (
            await contract.transact.transfer(
                TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address,
                5000
            )
        ).wait();

        const transferCriteria = contract.criteria.Transfer(
            undefined,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        );

        const transferCriteriaDelegator = contract.criteria.Transfer(
            undefined,
            TEST_ACCOUNTS.TRANSACTION.DELEGATOR.address
        );

        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria, transferCriteriaDelegator]
        });

        expect(
            events.map((event) => {
                return event.data;
            })
        ).toEqual([
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
            '0x0000000000000000000000000000000000000000000000000000000000001388',
            '0x0000000000000000000000000000000000000000000000000000000000001388'
        ]);

        expect(
            events.map((event) => {
                return event.topics;
            })
        ).toEqual([
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ],
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c39'
            ],
            [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                '0x00000000000000000000000088b2551c3ed42ca663796c10ce68c88a65f73fe2'
            ]
        ]);
    }, 20000); // Set a timeout of 10000ms for this test

    test('listen to a non existing ERC20 event', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        await expect(
            async () => await contract.filters.EventNotFound().get()
        ).rejects.toThrowError(InvalidAbiFunctionError);
    }, 10000);

    /**
     * Test listening to a non-existing ERC20 event.
     */
    test('listen to a non existing ERC20 event', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            signer
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        await expect(
            async () => await contract.filters.EventNotFound().get()
        ).rejects.toThrowError(InvalidAbiFunctionError);
    }, 10000);
});
