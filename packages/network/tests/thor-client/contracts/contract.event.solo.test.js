"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const fixture_2 = require("./fixture");
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
    (0, globals_1.beforeEach)(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey).bytes, new src_1.VeChainProvider(thorSoloClient));
    });
    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    (0, globals_1.test)('listen to ERC20 contract operations with the input as an args object and args array', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        // listen with an array of args
        const eventsWithArgsArray = await contract.filters
            .Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        ])
            .get();
        const expectedEvents = [
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                1000n
            ],
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                5000n
            ]
        ];
        (0, globals_1.expect)(eventsWithArgsArray.map((x) => x.decodedData)).toEqual(expectedEvents);
        // listen with an args object
        const eventsWithAnArgsObject = await contract.filters
            .Transfer({
            from: undefined,
            to: `0x${sdk_core_1.Address.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address).digits}`
        })
            .get();
        (0, globals_1.expect)(eventsWithAnArgsObject.map((x) => x.decodedData)).toEqual(expectedEvents);
    }, 30000); // Set a timeout of 30000ms for this test
    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    (0, globals_1.test)('listen to ERC20 contract operations building the criterias', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        const transferCriteria = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        ]);
        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria]
        });
        (0, globals_1.expect)(events.map((event) => {
            return event.data;
        })).toEqual([
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
            '0x0000000000000000000000000000000000000000000000000000000000001388'
        ]);
        (0, globals_1.expect)(events.map((event) => {
            return event.topics;
        })).toEqual([
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
    }, 30000); // Set a timeout of 30000ms for this test
    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    (0, globals_1.test)('listen to ERC20 contract operations building the criterias and decoding the event logs', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        const transferCriteria = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        ]);
        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria]
        });
        (0, globals_1.expect)(events.map((x) => x.decodedData)).toEqual([
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                1000n
            ],
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                5000n
            ]
        ]);
    }, 10000); // Set a timeout of 10000ms for this test
    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    (0, globals_1.test)('listen to ERC20 contract operations building the criterias and failing to decode the event logs due to wrong event ABI', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        const transferCriteria = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        ]);
        const approvalCriteria = contract.criteria.Approval();
        await (0, globals_1.expect)(async () => await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [
                {
                    criteria: transferCriteria.criteria,
                    eventAbi: approvalCriteria.eventAbi
                }
            ]
        })).rejects.toThrowError(sdk_errors_1.InvalidAbiItem);
    }, 30000);
    /**
     * Tests the listening to ERC20 contract operations using a blockchain client.
     */
    (0, globals_1.test)('listen to ERC20 raw contract operations with multiple criterias', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 5000n)).wait();
        const transferCriteria = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        ]);
        const transferCriteriaGasPayer = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address
        ]);
        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria, transferCriteriaGasPayer]
        });
        (0, globals_1.expect)(events.map((event) => {
            return event.data;
        })).toEqual([
            '0x00000000000000000000000000000000000000000000000000000000000003e8',
            '0x0000000000000000000000000000000000000000000000000000000000001388',
            '0x0000000000000000000000000000000000000000000000000000000000001388'
        ]);
        (0, globals_1.expect)(events.map((event) => {
            return event.topics;
        })).toEqual([
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
    }, 30000); // Set a timeout of 30000ms for this test
    /**
     * Tests the listening to ERC20 contract operations with multiple criteria decoding the result.
     */
    (0, globals_1.test)('listen to ERC20 decoded contract operations with multiple criterias', async () => {
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        factory = await factory.startDeployment();
        const contract = await factory.waitForDeployment();
        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        await (await contract.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address, 5000n)).wait();
        const transferCriteria = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address
        ]);
        const transferCriteriaGasPayer = contract.criteria.Transfer([
            undefined,
            fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.address
        ]);
        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria, transferCriteriaGasPayer]
        });
        (0, globals_1.expect)(events.map((x) => x.decodedData)).toEqual([
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                1000n
            ],
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                5000n
            ],
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x88B2551c3Ed42cA663796c10Ce68C88A65f73FE2',
                5000n
            ]
        ]);
    }, 20000); // Set a timeout of 10000ms for this test
    /**
     * Tests the listening to ERC20 contract operations with multiple criteria decoding the result.
     */
    (0, globals_1.test)('listen to multiple contract operations with multiple criteria', async () => {
        // Deploy the ERC20 contract
        let erc20Factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        erc20Factory = await erc20Factory.startDeployment();
        const contractERC20 = await erc20Factory.waitForDeployment();
        // Deploy the EventExample contract
        let factoryEventExample = thorSoloClient.contracts.createContractFactory(fixture_2.eventExampleAbi, fixture_2.eventExampleBytecode, signer);
        factoryEventExample = await factoryEventExample.startDeployment();
        const contractEventExample = await factoryEventExample.waitForDeployment();
        await (await contractERC20.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        await (await contractEventExample.transact.setValue(3000n)).wait();
        const transferCriteria = contractERC20.criteria.Transfer({
            to: `0x${sdk_core_1.Address.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address).digits}`
        });
        const valueCriteria = contractEventExample.criteria.ValueSet();
        const events = await thorSoloClient.logs.filterEventLogs({
            criteriaSet: [transferCriteria, valueCriteria]
        });
        (0, globals_1.expect)(events[0].decodedData).toEqual([
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
            '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
            5000n
        ]);
        (0, globals_1.expect)(events[1].decodedData).toEqual([
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
            3000n
        ]);
    }, 20000); // Set a timeout of 10000ms for this test
    /**
     * Tests the listening to ERC20 contract operations with multiple criteria decoding the result using the method to group the event by topic.
     */
    (0, globals_1.test)('listen to multiple contract operations with multiple criteria using the method to group the event by topic', async () => {
        // Deploy the ERC20 contract
        let erc20Factory = thorSoloClient.contracts.createContractFactory(sdk_core_1.ERC20_ABI, fixture_2.erc20ContractBytecode, signer);
        erc20Factory = await erc20Factory.startDeployment();
        const contractERC20 = await erc20Factory.waitForDeployment();
        // Deploy the EventExample contract
        let factoryEventExample = thorSoloClient.contracts.createContractFactory(fixture_2.eventExampleAbi, fixture_2.eventExampleBytecode, signer);
        factoryEventExample = await factoryEventExample.startDeployment();
        const contractEventExample = await factoryEventExample.waitForDeployment();
        await (await contractERC20.transact.transfer(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 5000n)).wait();
        await (await contractEventExample.transact.setValue(3000n)).wait();
        const transferCriteria = contractERC20.criteria.Transfer({
            to: `0x${sdk_core_1.Address.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address).digits}`
        });
        const valueCriteria = contractEventExample.criteria.ValueSet();
        const events = await thorSoloClient.logs.filterGroupedEventLogs({
            criteriaSet: [transferCriteria, valueCriteria]
        });
        (0, globals_1.expect)(events[0].map((x) => x.decodedData)).toEqual([
            [
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
                '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
                5000n
            ]
        ]);
        (0, globals_1.expect)(events[1].map((x) => x.decodedData)).toEqual([
            ['0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54', 3000n]
        ]);
    }, 30000); // Set a timeout of 10000ms for this test
});
