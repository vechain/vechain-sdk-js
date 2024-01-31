import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { soloNetwork, TEST_ACCOUNTS_THOR_SOLO } from '../../../fixture';
import {
    Transaction,
    type TransactionClause,
    TransactionHandler
} from '@vechain/vechain-sdk-core';
import {
    RPC_METHODS,
    RPCMethodsMap,
    type SendRawTransactionResultRPC
} from '../../../../src';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_sendRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendRawTransaction
 */
describe('RPC Mapper - eth_sendRawTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(soloNetwork);
    });

    /**
     * Destroy thor client after each test
     */
    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * eth_sendRawTransaction RPC call tests - Positive cases
     */
    describe('eth_sendRawTransaction - Positive cases', () => {
        /**
         * Positive case 1 - Send a simple raw transaction
         */
        test('eth_sendRawTransaction - Send a simple raw transaction', async () => {
            // 1 - Init sender and receiver

            const actors = {
                sender: TEST_ACCOUNTS_THOR_SOLO[1],
                receiver: TEST_ACCOUNTS_THOR_SOLO[2]
            };

            // 2- Init transaction

            // Init clauses
            const clauses: TransactionClause[] = [
                {
                    to: actors.receiver.address,
                    value: 1000000,
                    data: '0x'
                }
            ];

            // Get latest block
            const latestBlock = await thorClient.blocks.getBestBlock();

            // Estimate the gas required for the transfer transaction
            const gasResult = await thorClient.gas.estimateGas(
                clauses,
                actors.sender.address
            );

            // Create transactions
            const transaction = new Transaction({
                chainTag: 0xf6,
                blockRef:
                    latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
                expiration: 32,
                clauses,
                gasPriceCoef: 128,
                gas: gasResult.totalGas,
                dependsOn: null,
                nonce: 23456789
            });

            // 2- Sign transaction

            const signedTransaction = TransactionHandler.sign(
                transaction,
                Buffer.from(actors.sender.privateKey, 'hex')
            );

            const raw = `0x${signedTransaction.encoded.toString('hex')}`;

            // 3 - Send raw transaction

            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_sendRawTransaction
            ]([raw])) as SendRawTransactionResultRPC;

            expect(result.result).toBe(signedTransaction.id);
        });
    });

    /**
     * eth_sendRawTransaction RPC call tests - Negative cases
     */
    describe('eth_sendRawTransaction - Negative cases', () => {
        /**
         *  Invalid params
         */
        test('eth_sendRawTransaction - Invalid params', async () => {
            await expect(async () => {
                (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_sendRawTransaction
                ](['INVALID'])) as SendRawTransactionResultRPC;
            }).rejects.toThrowError(InvalidDataTypeError);
        });
    });
});
