import { ContractsModule } from '../../../../src/thor/thor-client/contracts/contracts-module';
import { ContractFactory } from '../../../../src/thor/thor-client/contracts/model/contract-factory';
import {
    createViemContract,
    getContract
} from '../../../../src/thor/thor-client/contracts/viem-adapter';
import { Address } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';

// Jest types
declare global {
    var jest: any;
    var expect: any;
}

// Mock HttpClient
const createMockHttpClient = () => ({
    get: jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ result: '0x0' }),
        text: jest.fn().mockResolvedValue('{"result":"0x0"}')
    }),
    post: jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ result: '0x0' }),
        text: jest.fn().mockResolvedValue('{"result":"0x0"}')
    }),
    put: jest.fn(),
    delete: jest.fn()
});

// Mock signer
const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn().mockResolvedValue('0xsigned_transaction_data')
});

// Test contract ABI
const testContractAbi = [
    {
        type: 'function',
        name: 'getValue',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'setValue',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'value', type: 'uint256' }],
        outputs: []
    },
    {
        type: 'event',
        name: 'ValueChanged',
        inputs: [
            { name: 'oldValue', type: 'uint256', indexed: true },
            { name: 'newValue', type: 'uint256', indexed: true }
        ]
    }
] as const;

/**
 * @group quarrantine
 */
describe('New Functionality Tests', () => {
    let contractsModule: ContractsModule;
    let mockHttpClient: any;
    let mockSigner: any;

    beforeEach(() => {
        mockHttpClient = createMockHttpClient();
        mockSigner = createMockSigner();
        contractsModule = new ContractsModule(mockHttpClient);
    });

    describe('ContractsModule New Methods', () => {
        test('Should create newContract factory', () => {
            const factory = contractsModule.newContract(
                testContractAbi,
                '0x608060405234801561001057600080fd5b50',
                mockSigner
            );

            expect(factory).toBeInstanceOf(ContractFactory);
            // Note: abi is private, so we can't test it directly
        });

        test('Should get contract info', async () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );

            const info = await contractsModule.getContractInfo(address);

            expect(info).toHaveProperty('address');
            expect(info).toHaveProperty('code');
            expect(info).toHaveProperty('isContract');
            expect(info.address).toBe(address.toString());
        });

        test('Should check if address is contract', async () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );

            const isContract = await contractsModule.isContract(address);

            expect(typeof isContract).toBe('boolean');
        });

        test('Should get contract bytecode', async () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );

            const bytecode = await contractsModule.getContractBytecode(address);

            expect(typeof bytecode).toBe('string');
        });

        test('Should get contract events', async () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );

            const events = await contractsModule.getContractEvents(
                address,
                0,
                100
            );

            expect(Array.isArray(events)).toBe(true);
        });

        test('Should watch contract events', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const callback = jest.fn();

            const watcher = contractsModule.watchContractEvents(
                address,
                'ValueChanged',
                callback
            );

            expect(watcher).toHaveProperty('unsubscribe');
            expect(typeof watcher.unsubscribe).toBe('function');
        });
    });

    describe('Contract New Methods', () => {
        let contract: any;

        beforeEach(() => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
        });

        test('Should set read options', () => {
            const options = { revision: 'best' };

            contract.setReadOptions(options);

            expect(contract.getContractCallOptions()).toEqual(options);
        });

        test('Should set transact options', () => {
            const options = { gasLimit: 100000 };

            contract.setTransactOptions(options);

            expect(contract.getContractTransactionOptions()).toEqual(options);
        });

        test('Should get contract address as string', () => {
            const address = contract.getAddress();

            expect(typeof address).toBe('string');
            expect(address).toBe('0x1234567890123456789012345678901234567890');
        });

        test('Should get contract ABI', () => {
            const abi = contract.getABI();

            expect(abi).toEqual(testContractAbi);
        });

        test('Should check if contract has function', () => {
            expect(contract.hasFunction('getValue')).toBe(true);
            expect(contract.hasFunction('setValue')).toBe(true);
            expect(contract.hasFunction('nonExistentFunction')).toBe(false);
        });

        test('Should check if contract has event', () => {
            expect(contract.hasEvent('ValueChanged')).toBe(true);
            expect(contract.hasEvent('NonExistentEvent')).toBe(false);
        });

        test('Should get function names', () => {
            const functionNames = contract.getFunctionNames();

            expect(Array.isArray(functionNames)).toBe(true);
            expect(functionNames).toContain('getValue');
            expect(functionNames).toContain('setValue');
        });

        test('Should get event names', () => {
            const eventNames = contract.getEventNames();

            expect(Array.isArray(eventNames)).toBe(true);
            expect(eventNames).toContain('ValueChanged');
        });

        test('Should get and set signer', () => {
            const newSigner = createMockSigner();

            contract.setSigner(newSigner);

            expect(contract.getSigner()).toBe(newSigner);
        });
    });

    describe('Viem Compatibility', () => {
        test('Should create viem contract', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );

            const viemContract = createViemContract(contract);

            expect(viemContract).toHaveProperty('address');
            expect(viemContract).toHaveProperty('abi');
            expect(viemContract).toHaveProperty('read');
            expect(viemContract).toHaveProperty('write');
            expect(viemContract).toHaveProperty('simulate');
            expect(viemContract).toHaveProperty('estimateGas');
            expect(viemContract).toHaveProperty('events');
            expect(viemContract).toHaveProperty('_vechain');
        });

        test('Should create viem contract with getContract', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );

            const viemContract = getContract(
                contractsModule,
                address,
                testContractAbi,
                mockSigner
            );

            expect(viemContract).toHaveProperty('address');
            expect(viemContract).toHaveProperty('abi');
            expect(viemContract).toHaveProperty('read');
            expect(viemContract).toHaveProperty('write');
            expect(viemContract).toHaveProperty('simulate');
            expect(viemContract).toHaveProperty('estimateGas');
            expect(viemContract).toHaveProperty('events');
            expect(viemContract).toHaveProperty('_vechain');
        });

        test('Should have viem-compatible read methods', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
            const viemContract = createViemContract(contract);

            expect(viemContract.read).toHaveProperty('getValue');
            expect(typeof viemContract.read.getValue).toBe('function');
        });

        test('Should have viem-compatible write methods', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
            const viemContract = createViemContract(contract);

            expect(viemContract.write).toHaveProperty('setValue');
            expect(typeof viemContract.write.setValue).toBe('function');
        });

        test('Should have viem-compatible simulate methods', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
            const viemContract = createViemContract(contract);

            expect(viemContract.simulate).toHaveProperty('setValue');
            expect(typeof viemContract.simulate.setValue).toBe('function');
        });

        test('Should have viem-compatible estimateGas methods', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
            const viemContract = createViemContract(contract);

            expect(viemContract.estimateGas).toHaveProperty('setValue');
            expect(typeof viemContract.estimateGas.setValue).toBe('function');
        });

        test('Should have viem-compatible event methods', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
            const viemContract = createViemContract(contract);

            expect(viemContract.events).toHaveProperty('ValueChanged');
            expect(viemContract.events.ValueChanged).toHaveProperty('address');
            expect(viemContract.events.ValueChanged).toHaveProperty('topics');
        });

        test('Should have VeChain-specific features', () => {
            const address = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const contract = contractsModule.load(
                address,
                testContractAbi,
                mockSigner
            );
            const viemContract = createViemContract(contract);

            expect(viemContract._vechain).toHaveProperty('setReadOptions');
            expect(viemContract._vechain).toHaveProperty('setTransactOptions');
            expect(viemContract._vechain).toHaveProperty('clause');
            expect(viemContract._vechain).toHaveProperty('criteria');
        });
    });
});
