import { describe, test, expect } from '@jest/globals';
import { coder } from '../../src';
import { exampleContractAbi } from '../clause/fixture';

/**
 * Unit tests for contract module.
 * @group unit/contract
 */
describe('Contract', () => {
    /**
     * Test compile an ERC20 contract and create an interface from the ABI.
     */
    test('Create an interface from the abi of the sample contract', () => {
        // Create an instance of a Contract interface using the ABI
        const contractInterface = coder.createInterface(exampleContractAbi);

        // Ensure the contract interface is created successfully
        expect(contractInterface).toBeDefined();
    });
});
