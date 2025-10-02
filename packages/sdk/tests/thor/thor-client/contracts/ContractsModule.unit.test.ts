import { describe, expect, test, jest } from '@jest/globals';
import { ContractsModule } from '../../../../src/thor/thor-client/contracts';
import { AbstractThorModule } from '../../../../src/thor/thor-client/AbstractThorModule';
import { Address } from '../../../../src/common/vcdm';

// Mock HttpClient
const createMockHttpClient = () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
});

// Simple contract ABI for testing
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
        inputs: [{ name: 'newValue', type: 'uint256' }],
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

// Mock signer
const createMockSigner = () => ({
    address: Address.of('0x1234567890123456789012345678901234567890'),
    sign: jest.fn()
});

/**
 * @group unit/contracts
 */
describe('ContractsModule', () => {
    describe('Constructor', () => {
        test('Should create instance with HttpClient', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);

            expect(contractsModule).toBeInstanceOf(ContractsModule);
            expect(contractsModule).toBeInstanceOf(AbstractThorModule);
        });
    });

    describe('Contract Loading', () => {
        test('Should load contract with address and ABI', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contractAddress = Address.of(
                '0x742d35Cc6634C0532925a3b844Bc454e4438f444'
            );

            const contract = contractsModule.load(
                contractAddress,
                testContractAbi
            );

            expect(contract).toBeDefined();
            expect(contract.address).toBe(contractAddress);
            expect(contract.abi).toBe(testContractAbi);
        });

        test('Should load contract with signer', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const contractAddress = Address.of(
                '0x742d35Cc6634C0532925a3b844Bc454e4438f444'
            );
            const signer = createMockSigner();

            const contract = contractsModule.load(
                contractAddress,
                testContractAbi,
                signer
            );

            expect(contract).toBeDefined();
            expect(contract.getSigner()).toBe(signer);
        });
    });

    describe('Contract Factory Creation', () => {
        test('Should create ContractFactory with ABI, bytecode, and signer', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);
            const signer = createMockSigner();
            const testBytecode =
                '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101a88061004e6000396000f3fe608060405234801561001057600080fd5b50600436106100345760003560e01c806360fe47b1146100395780636d4ce63c14610055575b600080fd5b610053600480360381019061004e91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

            const factory = contractsModule.createContractFactory(
                testContractAbi,
                testBytecode,
                signer
            );

            expect(factory).toBeDefined();
            expect(factory.getAbi()).toBe(testContractAbi);
            expect(factory.getBytecode()).toBe(testBytecode);
            expect(factory.getSigner()).toBe(signer);
        });
    });

    describe('Integration with AbstractThorModule', () => {
        test('Should extend AbstractThorModule', () => {
            const mockHttpClient = createMockHttpClient();
            const contractsModule = new ContractsModule(mockHttpClient);

            expect(contractsModule).toBeInstanceOf(AbstractThorModule);
        });
    });
});
