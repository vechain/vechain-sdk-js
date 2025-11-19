"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const assert_1 = require("assert");
const tsd_1 = require("tsd");
const viem_1 = require("viem");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
/**
 * Contract tests - encode & decode
 * @group unit/encode-decode
 */
(0, globals_1.describe)('Contract interface for ABI encoding/decoding', () => {
    let contractAbi;
    let contractAbiWithEvents;
    let erc721Abi;
    let contractStorageAbi;
    (0, globals_1.beforeAll)(() => {
        contractAbi = src_1.ABIContract.ofAbi(fixture_1.contractABI);
        contractAbiWithEvents = src_1.ABIContract.ofAbi(fixture_1.contractABIWithEvents);
        erc721Abi = src_1.ABIContract.ofAbi(src_1.ERC721_ABI);
        contractStorageAbi = src_1.ABIContract.ofAbi(fixture_1.contractStorageABI);
    });
    /**
     * Test the creation of a contract interface.
     */
    (0, globals_1.test)('Create a contract interface from an ABI json', () => {
        (0, globals_1.expect)(fixture_1.contractABI).toBeDefined();
    });
    /**
     * Test the encoding of a function ABI.
     */
    (0, globals_1.test)('get a function ABI and encode it', () => {
        (0, globals_1.expect)(contractAbi.encodeFunctionInput('setValue', [123])).toBeDefined();
        (0, globals_1.expect)(contractAbi.encodeFunctionInput('getValue')).toBeDefined();
    });
    /**
     * Test the encoding of a function ABI with the custom encoding function data method.
     */
    (0, globals_1.test)('get a function ABI and encode it', () => {
        (0, globals_1.expect)(contractAbi.encodeFunctionInput('setValue', [123])).toEqual(contractAbi.getFunction('setValue').encodeData([123]));
        (0, globals_1.expect)(contractAbi.encodeFunctionInput('getValue')).toEqual(contractAbi.encodeFunctionInput('getValue'));
    });
    /**
     * Test the error when getting a function ABI.
     */
    (0, globals_1.test)('get a function ABI and throw an error', () => {
        (0, globals_1.expect)(() => contractAbi.getFunction('undefined')).toThrowError(sdk_errors_1.InvalidAbiItem);
    });
    /**
     * Test the failed encoding of a function input.
     */
    (0, globals_1.test)('Fail to encode a contract function input', () => {
        (0, globals_1.expect)(() => contractAbi.encodeFunctionInput('undefined', [123])).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the decoding of a function ABI data with the custom decoding data method
     */
    (0, globals_1.test)('decode a function ABI data', () => {
        const encodedData = contractAbi.encodeFunctionInput('setValue', [123]);
        const functionInputDecoded = contractAbi.decodeFunctionInput('setValue', encodedData);
        (0, tsd_1.expectType)(functionInputDecoded);
        const decodedData = functionInputDecoded.args !== null &&
            functionInputDecoded.args !== undefined
            ? String(functionInputDecoded.args[0])
            : '';
        (0, globals_1.expect)(decodedData).toEqual('123');
        const fuctionDataDecoded = contractAbi
            .getFunction('setValue')
            .decodeData(encodedData);
        (0, tsd_1.expectType)(fuctionDataDecoded);
    });
    /**
     * Test the failed decoding of a function input.
     */
    (0, globals_1.test)('Fail to decode a contract function input', () => {
        (0, globals_1.expect)(() => contractAbi.decodeFunctionInput('setValue', src_1.Hex.of('0x123'))).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the encoding of an event ABI with the custom encoding method in contract.
     */
    (0, globals_1.test)('get an event ABI and encode it', () => {
        (0, globals_1.expect)(contractAbiWithEvents.encodeEventLog('ValueChanged', [
            fixture_1.ValueChangedEventData.sender,
            fixture_1.ValueChangedEventData.value
        ])).toEqual(contractAbiWithEvents
            .getEvent('ValueChanged')
            .encodeEventLog([
            fixture_1.ValueChangedEventData.sender,
            fixture_1.ValueChangedEventData.value
        ]));
    });
    /**
     * Test the error when getting an event ABI.
     */
    (0, globals_1.test)('get an event ABI and throw an error', () => {
        (0, globals_1.expect)(() => contractAbi.getEvent('undefined')).toThrowError(sdk_errors_1.InvalidAbiItem);
    });
    /**
     * Test the failed encoding of an event log.
     */
    (0, globals_1.test)('Fail to encode a contract event log', () => {
        (0, globals_1.expect)(() => contractAbi.encodeEventLog('undefined', [])).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the decoding of an encoded event with the custom decoding method in contract.
     */
    (0, globals_1.test)('get an event ABI and decode it', () => {
        const encodedEventLog = contractAbiWithEvents.encodeEventLog('ValueChanged', [fixture_1.ValueChangedEventData.sender, fixture_1.ValueChangedEventData.value]);
        (0, globals_1.expect)(contractAbiWithEvents.decodeEventLog('ValueChanged', encodedEventLog)).toEqual(contractAbiWithEvents.decodeEventLog('ValueChanged', {
            data: encodedEventLog.data,
            topics: encodedEventLog.topics
        }));
    });
    /**
     * Test the decoding of an encoded event log from a contract transaction.
     */
    (0, globals_1.test)('parse an event log and return decoded data', () => {
        const decodedEventLog = erc721Abi.parseLog(src_1.Hex.of('0x'), [
            src_1.Hex.of('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'),
            src_1.Hex.of('0x0000000000000000000000000000000000000000000000000000000000000000'),
            src_1.Hex.of('0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'),
            src_1.Hex.of('0x0000000000000000000000000000000000000000000000000000000000000001')
        ]);
        (0, tsd_1.expectType)(decodedEventLog);
        (0, globals_1.expect)(decodedEventLog).toBeDefined();
        (0, globals_1.expect)(decodedEventLog.eventName).toEqual('Transfer');
        (0, globals_1.expect)(decodedEventLog.args).toBeDefined();
        if (decodedEventLog.args === undefined) {
            (0, assert_1.fail)('Decoded event log args are undefined');
        }
        (0, globals_1.expect)(decodedEventLog.args.from).toEqual('0x0000000000000000000000000000000000000000');
        (0, globals_1.expect)(decodedEventLog.args.to).toEqual('0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54');
        (0, globals_1.expect)(decodedEventLog.args.tokenId).toEqual(1n);
    });
    /**
     * Test the decoding of an encoded event log from a contract transaction returned as an array of values.
     */
    (0, globals_1.test)('parse an event log and return decoded data as array', () => {
        const decodedEventLog = erc721Abi.parseLogAsArray(src_1.Hex.of('0x'), [
            src_1.Hex.of('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'),
            src_1.Hex.of('0x0000000000000000000000000000000000000000000000000000000000000000'),
            src_1.Hex.of('0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'),
            src_1.Hex.of('0x0000000000000000000000000000000000000000000000000000000000000001')
        ]);
        (0, globals_1.expect)(decodedEventLog).toBeDefined();
        (0, globals_1.expect)(decodedEventLog.length).toEqual(3);
        (0, globals_1.expect)(decodedEventLog[0]).toEqual('0x0000000000000000000000000000000000000000');
        (0, globals_1.expect)(decodedEventLog[1]).toEqual('0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54');
        (0, globals_1.expect)(decodedEventLog[2]).toEqual(1n);
    });
    /**
     * Test the error flow when parsing an event log with null and array topics.
     */
    (0, globals_1.test)('throw an error when parsing an event log with null and array topics', () => {
        (0, globals_1.expect)(() => {
            src_1.ABIEvent.parseLog(src_1.ERC721_ABI, {
                data: src_1.Hex.of('0x0'),
                topics: [
                    null,
                    src_1.Hex.of('0x0000000000000000000000000000000000000000000000000000000000000000'),
                    [
                        src_1.Hex.of('0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54')
                    ],
                    src_1.Hex.of('0x0000000000000000000000000000000000000000000000000000000000000001')
                ]
            });
        }).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the failed decoding of an encoded event log from a contract transaction.
     */
    (0, globals_1.test)('parse a bad formatted event log and throw an error', () => {
        (0, globals_1.expect)(() => {
            erc721Abi.parseLog(src_1.Hex.of('0x1'), [
                src_1.Hex.of('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'),
                src_1.Hex.of(''),
                src_1.Hex.of('0x000000000000000000000000f02f557c753edf5fcdcbfe4c'),
                src_1.Hex.of('0x00000000000000000000000000000000000000000001')
            ]);
        }).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the failed decoding of an event log.
     */
    (0, globals_1.test)('Fail to decode a contract function input', () => {
        (0, globals_1.expect)(() => contractAbi.decodeEventLog('ValueChanged', {
            data: src_1.Hex.of('0x123'),
            topics: []
        })).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the successful decoding of a function output.
     */
    (0, globals_1.test)('decode a function output successfully', () => {
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = (0, viem_1.encodeFunctionResult)({
            abi: fixture_1.contractStorageABI,
            functionName,
            result: mockReturnValue
        });
        const decodedOutput = contractStorageAbi.decodeFunctionOutput(functionName, src_1.Hex.of(encodedFunctionOutput));
        (0, tsd_1.expectType)(decodedOutput);
        (0, globals_1.expect)(decodedOutput).toBeDefined();
        (0, globals_1.expect)(decodedOutput).toEqual(mockReturnValue);
        const decodedOutputAsArray = contractStorageAbi
            .getFunction(functionName)
            .decodeOutputAsArray(src_1.Hex.of(encodedFunctionOutput));
        (0, globals_1.expect)(decodedOutputAsArray).toBeDefined();
        (0, globals_1.expect)(decodedOutputAsArray).toEqual([mockReturnValue]);
    });
    /**
     * Test the failed decoding of a function output due to wrong function name.
     */
    (0, globals_1.test)('fail to decode a function due to wrong function name', () => {
        const functionName = 'getValue';
        const mockReturnValue = 'test';
        const encodedFunctionOutput = (0, viem_1.encodeFunctionResult)({
            abi: fixture_1.contractStorageABI,
            functionName,
            result: mockReturnValue
        });
        (0, globals_1.expect)(() => contractStorageAbi.decodeFunctionOutput('invalidFunctionName', src_1.Hex.of(encodedFunctionOutput))).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
    });
    /**
     * Test the failed decoding of a function output due to wrong data.
     */
    (0, globals_1.test)('fail to decode a function due to wrong data', () => {
        const functionName = 'getValue';
        const encodedFunctionOutput = contractStorageAbi.encodeFunctionInput(functionName);
        (0, globals_1.expect)(() => contractStorageAbi.decodeFunctionOutput('getValue', src_1.Hex.of(encodedFunctionOutput.toString() + 'InvalidDataString'))).toThrowError(sdk_errors_1.InvalidDataType);
    });
    /**
     * Test ABIItem.ofSignature method.
     */
    (0, globals_1.test)('we get an ABI item from a signature', () => {
        const expected = contractAbiWithEvents.getEvent('ValueChanged');
        const expectedSignature = expected.signature;
        const actual = src_1.ABIItem.ofSignature(src_1.ABIEvent, expectedSignature);
        (0, globals_1.expect)(expectedSignature).toEqual(actual.signature);
        (0, globals_1.expect)(actual.isEqual(expected)).toBeTruthy();
    });
});
