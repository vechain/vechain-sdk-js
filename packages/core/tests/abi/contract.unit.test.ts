import { describe, expect, test } from '@jest/globals';
import {
    contractABI,
    contractABIWithEvents,
    contractStorageABI,
    ValueChangedEventData
} from './fixture';
import { abi, coder, ERC721_ABI } from '../../src';
import { ethers } from 'ethers';
import {
    InvalidAbiDataToDecodeError,
    InvalidAbiDataToEncodeError,
    InvalidAbiEventError
} from '@vechain/sdk-errors';

/**
 * Contract tests - encode & decode
 * @group unit/encode-decode
 */
describe('Contract interface for ABI encoding/decoding', () => {
    /**
     * Test the creation of a contract interface.
     */
    test('Create a contract interface from an ABI json', () => {
        expect(coder.createInterface(contractABI)).toBeDefined();
    });

    /**
     * Test the encoding of a function fragment.
     */
    test('get a function fragment and encode it', () => {
        const contractInterface = coder.createInterface(contractABI);

        expect(
            contractInterface.encodeFunctionData('setValue', [123])
        ).toBeDefined();
        expect(contractInterface.encodeFunctionData('getValue')).toBeDefined();
    });

    /**
     * Test the encoding of a function fragment with the custom encoding function data method.
     */
    test('get a function fragment and encode it', () => {
        const contractInterface = coder.createInterface(contractABI);

        expect(
            coder.encodeFunctionInput(contractABI, 'setValue', [123])
        ).toEqual(
            new abi.Function(
                contractInterface.getFunction('setValue')
            ).encodeInput([123])
        );

        expect(coder.encodeFunctionInput(contractABI, 'getValue')).toEqual(
            contractInterface.encodeFunctionData('getValue')
        );
    });

    /**
     * Test the failed encoding of a function input.
     */
    test('Fail to encode a contract function input', () => {
        expect(() =>
            coder.encodeFunctionInput(contractABI, 'undefined', [123])
        ).toThrowError(InvalidAbiDataToEncodeError);
    });

    /**
     * Test the decoding of a function fragment data with the custom decoding data method
     */
    test('decode a function fragment data', () => {
        const contractInterface = coder.createInterface(contractABI);
        const encodedData = contractInterface.encodeFunctionData('setValue', [
            123
        ]);
        const decodedData = String(
            coder.decodeFunctionInput(contractABI, 'setValue', encodedData)[0]
        );
        expect(decodedData).toEqual('123');
    });

    /**
     * Test the failed decoding of a function input.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            coder.decodeFunctionInput(contractABI, 'setValue', '0x123')
        ).toThrowError(InvalidAbiDataToDecodeError);
    });

    /**
     * Test the encoding of an event fragment with the custom encoding method in contract.
     */
    test('get an event fragment and encode it', () => {
        const contractInterface = new ethers.Interface(contractABIWithEvents);

        expect(
            coder.encodeEventLog(contractABIWithEvents, 'ValueChanged', [
                ValueChangedEventData.sender,
                ValueChangedEventData.value
            ])
        ).toEqual(
            contractInterface.encodeEventLog('ValueChanged', [
                ValueChangedEventData.sender,
                ValueChangedEventData.value
            ])
        );
    });

    /**
     * Test the failed encoding of an event log.
     */
    test('Fail to encode a contract event log', () => {
        expect(() =>
            coder.encodeEventLog(contractABI, 'undefined', [])
        ).toThrowError(InvalidAbiEventError);
    });

    /**
     * Test the decoding of an encoded event with the custom decoding method in contract.
     */
    test('get an event fragment and decode it', () => {
        const contractInterface = new ethers.Interface(contractABIWithEvents);
        const encodedEventLog = coder.encodeEventLog(
            contractABIWithEvents,
            'ValueChanged',
            [ValueChangedEventData.sender, ValueChangedEventData.value]
        );

        expect(
            coder.decodeEventLog(
                contractABIWithEvents,
                'ValueChanged',
                encodedEventLog
            )
        ).toEqual(
            contractInterface.decodeEventLog(
                'ValueChanged',
                encodedEventLog.data,
                encodedEventLog.topics
            )
        );
    });

    /**
     * Test the decoding of an encoded event log from a contract transaction.
     */
    test('parse an event log and return decoded data', () => {
        const decodedEventLog = coder.parseLog(ERC721_ABI, '0x', [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        ]);

        expect(decodedEventLog).toBeDefined();
        expect(decodedEventLog?.name).toEqual('Transfer');
        expect(decodedEventLog?.args).toBeDefined();
        expect(decodedEventLog?.args[0]).toEqual(
            '0x0000000000000000000000000000000000000000'
        );
        expect(decodedEventLog?.args[1]).toEqual(
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54'
        );
        expect(decodedEventLog?.args[2]).toEqual(1n);
    });

    /**
     * Test the failed decoding of an encoded event log from a contract transaction.
     */
    test('parse a bad formatted event log and throw an error', () => {
        expect(() => {
            coder.parseLog(ERC721_ABI, '0x1', [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '',
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c',
                '0x00000000000000000000000000000000000000000001'
            ]);
        }).toThrowError(InvalidAbiDataToDecodeError);
    });

    /**
     * Test the failed decoding of an event log.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            coder.decodeEventLog(contractABI, 'ValueChanged', {
                data: '0x123',
                topics: []
            })
        ).toThrowError(InvalidAbiEventError);
    });

    /**
     * Test the successful decoding of a function output.
     */
    test('decode a function output successfully', () => {
        const contractInterface = coder.createInterface(contractStorageABI);
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = contractInterface.encodeFunctionResult(
            functionName,
            [mockReturnValue]
        );

        const decodedOutput = coder.decodeFunctionOutput(
            contractStorageABI,
            functionName,
            encodedFunctionOutput
        );
        expect(decodedOutput).toBeDefined();
        expect(decodedOutput).toEqual([mockReturnValue]);
    });

    /**
     * Test the failed decoding of a function output due to wrong function name.
     */
    test('fail to decode a function due to wrong function name', () => {
        const contractInterface = coder.createInterface(contractStorageABI);
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = contractInterface.encodeFunctionResult(
            functionName,
            [mockReturnValue]
        );

        expect(() =>
            coder.decodeFunctionOutput(
                contractStorageABI,
                'invalidFunctionName',
                encodedFunctionOutput
            )
        ).toThrowError(InvalidAbiDataToDecodeError);
    });

    /**
     * Test the failed decoding of a function output due to wrong data.
     */
    test('fail to decode a function due to wrong data', () => {
        const contractInterface = coder.createInterface(contractStorageABI);
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = contractInterface.encodeFunctionResult(
            functionName,
            [mockReturnValue]
        );

        expect(() =>
            coder.decodeFunctionOutput(
                contractStorageABI,
                'getValue',
                encodedFunctionOutput + 'InvalidDataString'
            )
        ).toThrowError(InvalidAbiDataToDecodeError);
    });
});
