import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import {
    type SimulateTransactionClause,
    ThorClient
} from '@vechain/vechain-sdk-network';
import { testNetwork } from '../../../fixture';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_call' method
 *
 * @group integration/rpc-mapper/methods/eth_call
 */
describe('RPC Mapper - eth_call method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * eth_call RPC call tests - Positive cases
     */
    describe('eth_call - Positive cases', () => {
        /**
         * Positive case 1 - Sends 1 VET to the receiver.
         */
        const options = [
            {
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            }
        ] as SimulateTransactionClause[];

        test('eth_call - positive case 1', async () => {
            const response =
                await RPCMethodsMap(thorClient)[RPC_METHODS.eth_call](options);
            expect(response).toBe('0x');
        });

        /**
         * Positive case 1 - Send complex transaction object.
         */

        const transactionObj = [
            {
                caller: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567',
                gas: 30432,
                gasPrice: '0x9184e72a000',
                value: '0x9184e72a',
                data: '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'
            }
        ];

        test('eth_call - positive case 2', async () => {
            const response =
                await RPCMethodsMap(thorClient)[RPC_METHODS.eth_call](
                    transactionObj
                );
            expect(response).toBe('0x');
        });
    });

    /**
     * eth_call RPC call tests - Negative cases
     */
    describe('eth_call - Negative cases', () => {
        /**
         * Negative case 1 - No parameter passed
         */
        test('eth_call - no parameter passed', async () => {
            await expect(
                async () =>
                    await RPCMethodsMap(thorClient)[RPC_METHODS.eth_call]([])
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });
});
