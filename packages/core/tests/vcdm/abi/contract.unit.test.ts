import { beforeAll, describe, expect, test } from '@jest/globals';
import { fail } from 'assert';
import { expectType } from 'tsd';
import { type AbiEvent, encodeFunctionResult } from 'viem';
import {
    ABIContract,
    ABIEvent,
    ABIItem,
    AbiEventNotFoundError,
    AbiFunctionNotFoundError,
    ERC721_ABI,
    Hex,
    IllegalArgumentError,
    InvalidAbiDecodingTypeError,
    InvalidAbiEncodingTypeError
} from '../../../src';
import {
    contractABI,
    contractABIWithEvents,
    contractStorageABI,
    type ExpectedCustomFunctionType,
    type ExpectedERC721TransferEventType,
    ValueChangedEventData
} from './fixture';

/**
 * Contract tests - encode & decode
 * @group unit/encode-decode
 */
describe('Contract interface for ABI encoding/decoding', () => {
    let contractAbi: ABIContract<typeof contractABI>;
    let contractAbiWithEvents: ABIContract<typeof contractABIWithEvents>;
    let erc721Abi: ABIContract<typeof ERC721_ABI>;
    let contractStorageAbi: ABIContract<typeof contractStorageABI>;
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
     * Test the error when getting a function ABI.
     */
    test('get a function ABI and throw an error', () => {
        expect(() =>
            contractAbi.getFunction('undefined' as unknown as 'setValue')
        ).toThrowError(AbiFunctionNotFoundError);
    });

    /**
     * Test the failed encoding of a function input.
     */
    test('Fail to encode a contract function input', () => {
        expect(() =>
            contractAbi.encodeFunctionInput(
                'undefined' as unknown as 'setValue',
                [123]
            )
        ).toThrowError(InvalidAbiEncodingTypeError);
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
        expectType<ExpectedCustomFunctionType>(functionInputDecoded);
        const decodedData =
            functionInputDecoded.args !== null &&
            functionInputDecoded.args !== undefined
                ? String(functionInputDecoded.args[0])
                : '';
        expect(decodedData).toEqual('123');

        const fuctionDataDecoded = contractAbi
            .getFunction('setValue')
            .decodeData(encodedData);

        expectType<ExpectedCustomFunctionType>(fuctionDataDecoded);
    });

    /**
     * Test the failed decoding of a function input.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            contractAbi.decodeFunctionInput('setValue', Hex.of('0x123'))
        ).toThrowError(InvalidAbiDecodingTypeError);
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
            contractAbiWithEvents
                .getEvent('ValueChanged')
                .encodeEventLog([
                    ValueChangedEventData.sender,
                    ValueChangedEventData.value
                ])
        );
    });

    /**
     * Test the error when getting an event ABI.
     */
    test('get an event ABI and throw an error', () => {
        expect(() => contractAbi.getEvent('undefined')).toThrowError(
            AbiEventNotFoundError
        );
    });

    /**
     * Test the failed encoding of an event log.
     */
    test('Fail to encode a contract event log', () => {
        expect(() => contractAbi.encodeEventLog('undefined', [])).toThrowError(
            InvalidAbiEncodingTypeError
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
        const decodedEventLog = erc721Abi.parseLog<'Transfer'>(Hex.of('0x'), [
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

        expectType<ExpectedERC721TransferEventType>(decodedEventLog);
        expect(decodedEventLog).toBeDefined();
        expect(decodedEventLog.eventName).toEqual('Transfer');
        expect(decodedEventLog.args).toBeDefined();
        if (decodedEventLog.args === undefined) {
            fail('Decoded event log args are undefined');
        }
        expect(decodedEventLog.args.from).toEqual(
            '0x0000000000000000000000000000000000000000'
        );
        expect(decodedEventLog.args.to).toEqual(
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54'
        );
        expect(decodedEventLog.args.tokenId).toEqual(1n);
    });

    /**
     * Test the decoding of an encoded event log from a contract transaction returned as an array of values.
     */
    test('parse an event log and return decoded data as array', () => {
        const decodedEventLog = erc721Abi.parseLogAsArray(Hex.of('0x'), [
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
        expect(decodedEventLog.length).toEqual(3);
        expect(decodedEventLog[0]).toEqual(
            '0x0000000000000000000000000000000000000000'
        );
        expect(decodedEventLog[1]).toEqual(
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54'
        );
        expect(decodedEventLog[2]).toEqual(1n);
    });

    /**
     * Test the error flow when parsing an event log with null and array topics.
     */
    test('throw an error when parsing an event log with null and array topics', () => {
        expect(() => {
            ABIEvent.parseLog(ERC721_ABI, {
                data: Hex.of('0x0'),
                topics: [
                    null,
                    Hex.of(
                        '0x0000000000000000000000000000000000000000000000000000000000000000'
                    ),
                    [
                        Hex.of(
                            '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
                        )
                    ],
                    Hex.of(
                        '0x0000000000000000000000000000000000000000000000000000000000000001'
                    )
                ]
            });
        }).toThrowError(InvalidAbiDecodingTypeError);
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
        }).toThrowError(InvalidAbiDecodingTypeError);
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
        ).toThrowError(InvalidAbiDecodingTypeError);
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

        expectType<string>(decodedOutput);

        expect(decodedOutput).toBeDefined();
        expect(decodedOutput).toEqual(mockReturnValue);

        const decodedOutputAsArray = contractStorageAbi
            .getFunction(functionName)
            .decodeOutputAsArray(Hex.of(encodedFunctionOutput));

        expect(decodedOutputAsArray).toBeDefined();
        expect(decodedOutputAsArray).toEqual([mockReturnValue]);
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
                'invalidFunctionName' as unknown as 'getValue',
                Hex.of(encodedFunctionOutput)
            )
        ).toThrowError(InvalidAbiDecodingTypeError);
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
        ).toThrowError(IllegalArgumentError);
    });

    /**
     * Test ABIItem.ofSignature method.
     */
    test('we get an ABI item from a signature', () => {
        const expected = contractAbiWithEvents.getEvent('ValueChanged');
        const expectedSignature = expected.signature as AbiEvent;
        const actual = ABIItem.ofSignature(ABIEvent, expectedSignature);
        expect(expectedSignature).toEqual(actual.signature);
        expect(actual.isEqual(expected)).toBeTruthy();
    });
});
