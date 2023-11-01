import { describe, expect, test } from '@jest/globals';
import {
    ValueChangedEventData,
    contractABI,
    contractABIWithEvents
} from './fixture';
import { contract } from '../../src/abi/contract';
import { abi } from '../../src';
import { ethers } from 'ethers';

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
            contract.encodeFunctionInput(contractABI, 'setValue', [123])
        ).toEqual(
            new abi.Function(
                contractInterface.getFunction('setValue')
            ).encodeInput([123])
        );

        expect(contract.encodeFunctionInput(contractABI, 'getValue')).toEqual(
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
            contract.decodeFunctionInput(
                contractABI,
                'setValue',
                encodedData
            )[0]
        );
        expect(decodedData).toEqual('123');
    });

    /**
     * Test the encoding of an event fragment with the custom encoding method in contract.
     */
    test('get an event fragment and encode it', () => {
        const contractInterface = new ethers.Interface(contractABIWithEvents);

        expect(
            contract.encodeEventLog(contractABIWithEvents, 'ValueChanged', [
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
     * Test the decoding of an encoded event with the custom decoding method in contract.
     */
    test('get an event fragment and decode it', () => {
        const contractInterface = new ethers.Interface(contractABIWithEvents);
        const encodedEventLog = contract.encodeEventLog(
            contractABIWithEvents,
            'ValueChanged',
            [ValueChangedEventData.sender, ValueChangedEventData.value]
        );

        expect(
            contract.decodeEventLog(
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
});
