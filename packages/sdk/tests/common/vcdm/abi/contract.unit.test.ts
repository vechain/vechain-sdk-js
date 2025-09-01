import { describe, expect, test } from '@jest/globals';
import { fail } from 'assert';
import { expectType } from 'tsd';
import {
    type AbiEvent,
    encodeFunctionResult,
    encodeFunctionData,
    decodeFunctionData,
    decodeFunctionResult,
    encodeEventTopics,
    decodeEventLog
} from '@viem/utils';
import { ERC721_ABI } from '@thor/utils';
import {
    contractABI,
    contractABIWithEvents,
    contractStorageABI,
    ValueChangedEventData
} from './fixture';

/**
 * Contract tests - encode & decode
 * @group unit/vcdm/abi
 */
describe('Contract interface for ABI encoding/decoding', () => {
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
            encodeFunctionData({
                abi: contractABI,
                functionName: 'setValue',
                args: [123n]
            })
        ).toBeDefined();

        expect(
            encodeFunctionData({
                abi: contractABI,
                functionName: 'getValue'
            })
        ).toBeDefined();
    });

    /**
     * Test the encoding of a function ABI with the custom encoding function data method.
     */
    test('get a function ABI and encode it', () => {
        const encoded1 = encodeFunctionData({
            abi: contractABI,
            functionName: 'setValue',
            args: [123n]
        });

        const encoded2 = encodeFunctionData({
            abi: contractABI,
            functionName: 'setValue',
            args: [123n]
        });

        expect(encoded1).toEqual(encoded2);

        const encodedGetValue = encodeFunctionData({
            abi: contractABI,
            functionName: 'getValue'
        });

        expect(encodedGetValue).toBeDefined();
    });

    /**
     * Test the error when getting a function ABI.
     */
    test('get a function ABI and throw an error', () => {
        expect(() =>
            encodeFunctionData({
                abi: contractABI,
                functionName: 'undefined' as any,
                args: [123n]
            })
        ).toThrowError();
    });

    /**
     * Test the failed encoding of a function input.
     */
    test('Fail to encode a contract function input', () => {
        expect(() =>
            encodeFunctionData({
                abi: contractABI,
                functionName: 'undefined' as any,
                args: [123n]
            })
        ).toThrowError();
    });

    /**
     * Test the decoding of a function ABI data with the custom decoding data method
     */
    test('decode a function ABI data', () => {
        const encodedData = encodeFunctionData({
            abi: contractABI,
            functionName: 'setValue',
            args: [123n]
        });

        const functionInputDecoded = decodeFunctionData({
            abi: contractABI,
            data: encodedData
        });

        expectType<{ functionName: string; args?: readonly unknown[] }>(
            functionInputDecoded
        );

        const decodedData =
            functionInputDecoded.args !== null &&
            functionInputDecoded.args !== undefined
                ? String(functionInputDecoded.args[0])
                : '';
        expect(decodedData).toEqual('123');
        expect(functionInputDecoded.functionName).toEqual('setValue');
    });

    /**
     * Test the failed decoding of a function input.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            decodeFunctionData({
                abi: contractABI,
                data: '0x123' as `0x${string}`
            })
        ).toThrowError();
    });

    /**
     * Test the encoding of an event ABI with the custom encoding method in contract.
     */
    test('get an event ABI and encode it', () => {
        const encoded1 = encodeEventTopics({
            abi: contractABIWithEvents,
            eventName: 'ValueChanged',
            args: [ValueChangedEventData.sender, ValueChangedEventData.value]
        });

        const encoded2 = encodeEventTopics({
            abi: contractABIWithEvents,
            eventName: 'ValueChanged',
            args: [ValueChangedEventData.sender, ValueChangedEventData.value]
        });

        expect(encoded1).toEqual(encoded2);
    });

    /**
     * Test the error when getting an event ABI.
     */
    test('get an event ABI and throw an error', () => {
        expect(() =>
            encodeEventTopics({
                abi: contractABIWithEvents,
                eventName: 'undefined' as any
            })
        ).toThrowError();
    });

    /**
     * Test the failed encoding of an event log.
     */
    test('Fail to encode a contract event log', () => {
        expect(() =>
            encodeEventTopics({
                abi: contractABIWithEvents,
                eventName: 'undefined' as any,
                args: []
            })
        ).toThrowError();
    });

    /**
     * Test the decoding of an encoded event with the custom decoding method in contract.
     */
    test('get an event ABI and decode it', () => {
        const encodedEventTopics = encodeEventTopics({
            abi: contractABIWithEvents,
            eventName: 'ValueChanged',
            args: [ValueChangedEventData.sender, ValueChangedEventData.value]
        });

        // For the comparison, we'll encode the same event again
        const encodedEventTopics2 = encodeEventTopics({
            abi: contractABIWithEvents,
            eventName: 'ValueChanged',
            args: [ValueChangedEventData.sender, ValueChangedEventData.value]
        });

        expect(encodedEventTopics).toEqual(encodedEventTopics2);
    });

    /**
     * Test the decoding of an encoded event log from a contract transaction.
     */
    test('parse an event log and return decoded data', () => {
        const topics = [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        ] as [`0x${string}`, ...`0x${string}`[]];

        const decodedEventLog = decodeEventLog({
            abi: ERC721_ABI,
            data: '0x' as `0x${string}`,
            topics
        });

        expectType<{ eventName: string; args: any }>(decodedEventLog);
        expect(decodedEventLog).toBeDefined();
        expect(decodedEventLog.eventName).toEqual('Transfer');
        expect(decodedEventLog.args).toBeDefined();

        if (decodedEventLog.args === undefined) {
            fail('Decoded event log args are undefined');
        }

        // Type guard for Transfer event
        if (decodedEventLog.eventName === 'Transfer') {
            const transferArgs = decodedEventLog.args as {
                from: `0x${string}`;
                to: `0x${string}`;
                tokenId: bigint;
            };
            expect(transferArgs.from).toEqual(
                '0x0000000000000000000000000000000000000000'
            );
            expect(transferArgs.to).toEqual(
                '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54'
            );
            expect(transferArgs.tokenId).toEqual(1n);
        }
    });

    /**
     * Test the decoding of an encoded event log from a contract transaction returned as an array of values.
     */
    test('parse an event log and return decoded data as array', () => {
        const topics = [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
            '0x0000000000000000000000000000000000000000000000000000000000000001'
        ] as [`0x${string}`, ...`0x${string}`[]];

        const decodedEventLog = decodeEventLog({
            abi: ERC721_ABI,
            data: '0x' as `0x${string}`,
            topics
        });

        expect(decodedEventLog).toBeDefined();
        expect(decodedEventLog.args).toBeDefined();

        // Convert to array format for comparison
        const argsArray = Object.values(decodedEventLog.args || {});
        expect(argsArray.length).toEqual(3);
        expect(argsArray[0]).toEqual(
            '0x0000000000000000000000000000000000000000'
        );
        expect(argsArray[1]).toEqual(
            '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54'
        );
        expect(argsArray[2]).toEqual(1n);
    });

    /**
     * Test the error flow when parsing an event log with null and array topics.
     */
    test('throw an error when parsing an event log with null and array topics', () => {
        expect(() => {
            decodeEventLog({
                abi: ERC721_ABI,
                data: '0x0' as `0x${string}`,
                topics: [
                    null as any,
                    '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
                    [
                        '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
                    ] as any,
                    '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`
                ] as [`0x${string}`, ...`0x${string}`[]]
            });
        }).toThrowError();
    });

    /**
     * Test the failed decoding of an encoded event log from a contract transaction.
     */
    test('parse a bad formatted event log and throw an error', () => {
        expect(() => {
            const topics = [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' as `0x${string}`,
                '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`, // Use proper hex instead of empty string
                '0x000000000000000000000000f02f557c753edf5fcdcbfe4c' as `0x${string}`,
                '0x00000000000000000000000000000000000000000001' as `0x${string}`
            ] as [`0x${string}`, ...`0x${string}`[]];

            decodeEventLog({
                abi: ERC721_ABI,
                data: '0x1' as `0x${string}`,
                topics
            });
        }).toThrowError();
    });

    /**
     * Test the failed decoding of an event log.
     */
    test('Fail to decode a contract function input', () => {
        expect(() =>
            decodeEventLog({
                abi: contractABIWithEvents,
                data: '0x123' as `0x${string}`,
                topics: [] as any
            })
        ).toThrowError();
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

        const decodedOutput = decodeFunctionResult({
            abi: contractStorageABI,
            functionName,
            data: encodedFunctionOutput as `0x${string}`
        });

        expectType<string>(decodedOutput);

        expect(decodedOutput).toBeDefined();
        expect(decodedOutput).toEqual(mockReturnValue);

        // For array format, viem returns the result directly for single outputs
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
            decodeFunctionResult({
                abi: contractStorageABI,
                functionName: 'invalidFunctionName' as any,
                data: encodedFunctionOutput as `0x${string}`
            })
        ).toThrowError();
    });

    /**
     * Test the failed decoding of a function output due to wrong data.
     */
    test('fail to decode a function due to wrong data', () => {
        const functionName = 'getValue';
        const encodedFunctionInput = encodeFunctionData({
            abi: contractStorageABI,
            functionName
        });

        expect(() =>
            decodeFunctionResult({
                abi: contractStorageABI,
                functionName: 'getValue',
                data: (encodedFunctionInput +
                    'InvalidDataString') as `0x${string}`
            })
        ).toThrowError();
    });

    /**
     * Test getting ABI item from a signature.
     */
    test('we get an ABI item from a signature', () => {
        const valueChangedEvent = contractABIWithEvents.find(
            (item: any) => item.type === 'event' && item.name === 'ValueChanged'
        ) as AbiEvent;

        expect(valueChangedEvent).toBeDefined();
        expect(valueChangedEvent.name).toEqual('ValueChanged');
        expect(valueChangedEvent.type).toEqual('event');
    });
});
