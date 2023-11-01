import { describe, expect, test } from '@jest/globals';
import { contractABI } from './fixture';
import { contract } from '../../src/abi/contract';

/**
 * Contract tests - encode & decode
 * @group unit/encode-decode
 */
describe('Contract interface for ABI encoding/decoding', () => {
    /**
     * Test the creation of a contract interface.
     */
    test('Create a contract interface from an ABI json', () => {
        expect(contract.createInterface(contractABI)).toBeDefined();
    });

    /**
     * Test the encoding of a function fragment.
     */
    test('get a function fragment and encode it', () => {
        const contractInterface = contract.createInterface(contractABI);

        expect(
            contractInterface.encodeFunctionData('setValue', [123])
        ).toBeDefined();
        expect(contractInterface.encodeFunctionData('getValue')).toBeDefined();
    });

    /**
     * Test the encoding of a function fragment with the custom encoding function data method.
     */
    test('get a function fragment and encode it', () => {
        const contractInterface = contract.createInterface(contractABI);

        expect(
            contract.encodeFunctionData(contractABI, 'setValue', [123])
        ).toEqual(contractInterface.encodeFunctionData('setValue', [123]));
        expect(contract.encodeFunctionData(contractABI, 'getValue')).toEqual(
            contractInterface.encodeFunctionData('getValue')
        );
    });

    /**
     * Test the decoding of a function fragment data with the custom decoding data method
     */
    test('decode a function fragment data', () => {
        const contractInterface = contract.createInterface(contractABI);
        const encodedData = contractInterface.encodeFunctionData('setValue', [
            123
        ]);
        const decodedData = String(
            contract.decodeFunctionData(contractABI, 'setValue', encodedData)[0]
        );
        expect(decodedData).toEqual('123');
    });
});
