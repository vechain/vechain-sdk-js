import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
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

/**
 * RPC Mapper integration tests for 'eth_getBlockByNumber' method
 *
 * @group integration/rpc-mapper/methods/eth_getBlockByNumber
 */
describe('RPC Mapper - eth_getBlockByNumber method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(new SimpleHttpClient(THOR_SOLO_URL), {
            isPollingEnabled: true
        });
    });

    afterEach(() => {
        thorClient.destroy();
    });

    describe('GALACTICA - baseFeePerGas', () => {
        test('OK <- blocks/1?expanded=false', async () => {
            const actual = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x01', false]);
            expect(actual).toBeDefined();
            const block = actual as BlocksRPC;
            expect(HexUInt.isValid0x(block.baseFeePerGas)).toBeTruthy();
            expect(HexUInt.of(block.baseFeePerGas).bi).toBeGreaterThan(0n);
        });

        test('OK <- blocks/1?expanded=true', async () => {
            const actual = await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_getBlockByNumber
            ](['0x01', true]);
            expect(actual).toBeDefined();
            const block = actual as BlocksRPC;
            expect(HexUInt.isValid0x(block.baseFeePerGas)).toBeTruthy();
            expect(HexUInt.of(block.baseFeePerGas).bi).toBeGreaterThan(0n);
            block.transactions.forEach((tx) => {
                const transactionRPC = tx as TransactionRPC;
                expect(HexUInt.isValid0x(transactionRPC.type)).toBeTruthy();
                expect(
                    HexUInt.isValid0x(transactionRPC.maxFeePerGas)
                ).toBeTruthy();
                expect(
                    HexUInt.isValid0x(transactionRPC.maxPriorityFeePerGas)
                ).toBeTruthy();
            });
            console.log(JSON.stringify(block, null, 2));
        });
    });
});
