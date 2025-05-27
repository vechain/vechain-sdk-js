import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type BlocksRPC,
    RPC_METHODS,
    RPCMethodsMap,
    SimpleHttpClient,
    THOR_SOLO_URL,
    ThorClient,
    type TransactionRPC
} from '../../../../../src';
import { HexUInt } from '@vechain/sdk-core';
import { ethGetBlockByNumberTestCases } from './fixture';

/**
 * RPC Mapper integration tests for 'eth_getBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByNumber
 */
describe('RPC Mapper - eth_getBlockByNumber method tests', () => {
    // Add retry configuration for all tests in this suite
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

    // Increase timeout for RPC tests
    const TIMEOUT = 30000; // 30 seconds

    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(new SimpleHttpClient(THOR_SOLO_URL), {
            isPollingEnabled: true
        });
    });

    describe('GALACTICA - baseFeePerGas', () => {
        test('OK <- blocks/0?expanded=false', async () => {
            const actual = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x0', false]);
            expect(actual).toBeDefined();
            const block = actual as BlocksRPC;
            expect(block.baseFeePerGas).toBeUndefined();
        });

        test('OK <- blocks/0?expanded=true', async () => {
            const actual = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x0', true]);
            expect(actual).toBeDefined();
            const block = actual as BlocksRPC;
            expect(block.baseFeePerGas).toBeUndefined();
            expect(block.transactions.length).toBe(0);
        });

        test('OK <- blocks/1?expanded=false', async () => {
            const actual = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x01', false]);
            expect(actual).toBeDefined();
            const block = actual as BlocksRPC;
            expect(block.baseFeePerGas).toBeDefined();
            expect(block.baseFeePerGas).not.toBeNull();
            expect(
                HexUInt.isValid0x(block.baseFeePerGas as string)
            ).toBeTruthy();
            expect(
                HexUInt.of(block.baseFeePerGas as string).bi
            ).toBeGreaterThan(0n);
        });

        test('OK <- blocks/1?expanded=true', async () => {
            const actual = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x01', true]);
            expect(actual).toBeDefined();
            const block = actual as BlocksRPC;
            expect(block.baseFeePerGas).toBeDefined();
            expect(block.baseFeePerGas).not.toBeNull();
            expect(
                HexUInt.isValid0x(block.baseFeePerGas as string)
            ).toBeTruthy();
            expect(
                HexUInt.of(block.baseFeePerGas as string).bi
            ).toBeGreaterThan(0n);
            block.transactions.forEach((tx) => {
                const transactionRPC = tx as TransactionRPC;
                expect(HexUInt.isValid0x(transactionRPC.type)).toBeTruthy();
                if (
                    transactionRPC.maxFeePerGas !== undefined &&
                    transactionRPC.maxFeePerGas !== null
                ) {
                    expect(
                        HexUInt.isValid0x(transactionRPC.maxFeePerGas)
                    ).toBeTruthy();
                }
                if (
                    transactionRPC.maxPriorityFeePerGas !== undefined &&
                    transactionRPC.maxPriorityFeePerGas !== null
                ) {
                    expect(
                        HexUInt.isValid0x(transactionRPC.maxPriorityFeePerGas)
                    ).toBeTruthy();
                }
            });
            console.log(JSON.stringify(block, null, 2));
        });
    });

    /**
     * eth_getBlockByNumber RPC call tests - Positive cases
     */
    describe('eth_getBlockByNumber - Positive cases', () => {
        /**
         * Test cases for eth_getBlockByNumber RPC method
         */
        ethGetBlockByNumberTestCases.forEach(
            ({ description, params, expected }) => {
                test(
                    description,
                    async () => {
                        const rpcCall =
                            await RPCMethodsMap(thorClient)[
                                RPC_METHODS.eth_getBlockByNumber
                            ](params);

                        // Compare the result with the expected value
                        expect(rpcCall).toStrictEqual(expected);
                    },
                    TIMEOUT
                );
            }
        );

        /**
         * Positive case 1 - Should be able to get block by number
         */
        test(
            'eth_getBlockByNumber - Should be able to get block by number',
            async () => {
                const rpcCall = (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getBlockByNumber
                ](['0x1', false])) as BlocksRPC;

                expect(rpcCall).toBeDefined();
                expect(rpcCall.number).toBe('0x1');
            },
            TIMEOUT
        );

        /**
         * Positive case 2 - Should be able to get block by number with full transaction objects
         */
        test(
            'eth_getBlockByNumber - Should be able to get block by number with full transaction objects',
            async () => {
                const rpcCall = (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_getBlockByNumber
                ](['0x1', true])) as BlocksRPC;

                expect(rpcCall).toBeDefined();
                expect(rpcCall.number).toBe('0x1');
                expect(rpcCall.transactions).toBeDefined();
                expect(Array.isArray(rpcCall.transactions)).toBe(true);
            },
            TIMEOUT
        );
    });
});
