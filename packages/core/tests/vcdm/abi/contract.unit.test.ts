import { beforeAll, describe, expect, test } from '@jest/globals';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidDataType
} from '@vechain/sdk-errors';
import { fail } from 'assert';
import { encodeFunctionResult } from 'viem';
import { ABIContract, ERC721_ABI, Hex } from '../../../src';
import {
    contractABI,
    contractABIWithEvents,
    contractStorageABI,
    ValueChangedEventData
} from './fixture';

/**
 * Contract tests - encode & decode
 * @group unit/encode-decode
 */
describe('Contract interface for ABI encoding/decoding', () => {
    let contractAbi: ABIContract;
    let contractAbiWithEvents: ABIContract;
    let erc721Abi: ABIContract;
    let contractStorageAbi: ABIContract;
    beforeAll(() => {
        contractAbi = ABIContract.ofAbi(contractABI);
        contractAbiWithEvents = ABIContract.ofAbi(contractABIWithEvents);
        erc721Abi = ABIContract.ofAbi(ERC721_ABI);
        contractStorageAbi = ABIContract.ofAbi(contractStorageABI);
    });
    /**
     * Test the creation of a contract interface.
     */
    test('Create a contract interface from an ABI json', () => {
        expect(contractABI).toBeDefined();
    });

    /**
     * Test the encoding of a function ABI.
     */
    test('get a function ABI and encode it', () => {
        expect(
            contractAbi.encodeFunctionInput('setValue', [123])
        ).toBeDefined();
        expect(contractAbi.encodeFunctionInput('getValue')).toBeDefined();
    });

    /**
     * Test the encoding of a function ABI with the custom encoding function data method.
     */
    test('get a function ABI and encode it', () => {
        expect(contractAbi.encodeFunctionInput('setValue', [123])).toEqual(
            contractAbi.getFunction('setValue').encodeData([123])
        );

        expect(contractAbi.encodeFunctionInput('getValue')).toEqual(
            contractAbi.encodeFunctionInput('getValue')
        );
    });

    /**
     * Test the failed encoding of a function input.
     */
    test('Fail to encode a contract function input', () => {
        expect(() =>
            contractAbi.encodeFunctionInput('undefined', [123])
        ).toThrowError(InvalidAbiDataToEncodeOrDecode);
    });

    /**
     * Test the decoding of a function ABI data with the custom decoding data method
     */
    test('decode a function ABI data', () => {
        const encodedData = contractAbi.encodeFunctionInput('setValue', [123]);
        const functionInputDecoded = contractAbi.decodeFunctionInput(
            'setValue',
            encodedData
        );
        const decodedData =
            functionInputDecoded.args !== null &&
            functionInputDecoded.args !== undefined
                ? String(functionInputDecoded.args[0])
                : '';
        expect(decodedData).toEqual('123');
    });

    /**
     * Test the failed decoding of a function input.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            contractAbi.decodeFunctionInput('setValue', Hex.of('0x123'))
        ).toThrowError(InvalidAbiDataToEncodeOrDecode);
    });

    /**
     * Test the encoding of an event ABI with the custom encoding method in contract.
     */
    test('get an event ABI and encode it', () => {
        expect(
            contractAbiWithEvents.encodeEventLog('ValueChanged', [
                ValueChangedEventData.sender,
                ValueChangedEventData.value
            ])
        ).toEqual(
            contractAbiWithEvents.encodeEventLog('ValueChanged', [
                ValueChangedEventData.sender,
                ValueChangedEventData.value
            ])
        );
    });

    /**
     * Test the failed encoding of an event log.
     */
    test('Fail to encode a contract event log', () => {
        expect(() => contractAbi.encodeEventLog('undefined', [])).toThrowError(
            InvalidAbiDataToEncodeOrDecode
        );
    });

    /**
     * Test the decoding of an encoded event with the custom decoding method in contract.
     */
    test('get an event ABI and decode it', () => {
        const encodedEventLog = contractAbiWithEvents.encodeEventLog(
            'ValueChanged',
            [ValueChangedEventData.sender, ValueChangedEventData.value]
        );

        expect(
            contractAbiWithEvents.decodeEventLog(
                'ValueChanged',
                encodedEventLog
            )
        ).toEqual(
            contractAbiWithEvents.decodeEventLog('ValueChanged', {
                data: encodedEventLog.data,
                topics: encodedEventLog.topics
            })
        );
    });

    /**
     * Test the decoding of an encoded event log from a contract transaction.
     */
    test('parse an event log and return decoded data', () => {
        const decodedEventLog = erc721Abi.parseLog(Hex.of('0x'), [
            Hex.of(
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            ),
            Hex.of(
                '0x0000000000000000000000000000000000000000000000000000000000000000'
            ),
            Hex.of(
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
            ),
            Hex.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            )
        ]);

        expect(decodedEventLog).toBeDefined();
        expect(decodedEventLog.eventName).toEqual('Transfer');
        expect(decodedEventLog.args).toBeDefined();
        if (decodedEventLog.args === undefined) {
            fail('Decoded event log args are undefined');
        }
        const argsValues = Object.values(decodedEventLog.args);
        expect(argsValues[0]).toEqual(
            '0x0000000000000000000000000000000000000000'
        );
        expect(argsValues[1]).toEqual(
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54'
        );
        expect(argsValues[2]).toEqual(1n);
    });

    /**
     * Test the failed decoding of an encoded event log from a contract transaction.
     */
    test('parse a bad formatted event log and throw an error', () => {
        expect(() => {
            erc721Abi.parseLog(Hex.of('0x1'), [
                Hex.of(
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
                ),
                Hex.of(''),
                Hex.of('0x000000000000000000000000f02f557c753edf5fcdcbfe4c'),
                Hex.of('0x00000000000000000000000000000000000000000001')
            ]);
        }).toThrowError(InvalidAbiDataToEncodeOrDecode);
    });

    /**
     * Test the failed decoding of an event log.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            contractAbi.decodeEventLog('ValueChanged', {
                data: Hex.of('0x123'),
                topics: []
            })
        ).toThrowError(InvalidAbiDataToEncodeOrDecode);
    });

    /**
     * Test the successful decoding of a function output.
     */
    test('decode a function output successfully', () => {
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = encodeFunctionResult({
            abi: contractStorageABI,
            functionName,
            result: mockReturnValue
        });

        const decodedOutput = contractStorageAbi.decodeFunctionOutput(
            functionName,
            Hex.of(encodedFunctionOutput)
        );
        expect(decodedOutput).toBeDefined();
        expect(decodedOutput).toEqual(mockReturnValue);
    });

    /**
     * Test the failed decoding of a function output due to wrong function name.
     */
    test('fail to decode a function due to wrong function name', () => {
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = encodeFunctionResult({
            abi: contractStorageABI,
            functionName,
            result: mockReturnValue
        });

        expect(() =>
            contractStorageAbi.decodeFunctionOutput(
                'invalidFunctionName',
                Hex.of(encodedFunctionOutput)
            )
        ).toThrowError(InvalidAbiDataToEncodeOrDecode);
    });

    /**
     * Test the failed decoding of a function output due to wrong data.
     */
    test('fail to decode a function due to wrong data', () => {
        const functionName = 'getValue';
        const encodedFunctionOutput =
            contractStorageAbi.encodeFunctionInput(functionName);

        expect(() =>
            contractStorageAbi.decodeFunctionOutput(
                'getValue',
                Hex.of(encodedFunctionOutput.toString() + 'InvalidDataString')
            )
        ).toThrowError(InvalidDataType);
    });
});
