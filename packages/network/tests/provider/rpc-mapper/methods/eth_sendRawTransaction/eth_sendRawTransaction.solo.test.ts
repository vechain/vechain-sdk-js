import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    HexUInt,
    Transaction,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { getUnusedAccount } from '../../../../fixture';

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
        thorClient = ThorClient.at(THOR_SOLO_URL);
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
                sender: getUnusedAccount(),
                receiver: getUnusedAccount()
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
            const latestBlock =
                await thorClient.blocks.getBestBlockCompressed();

            // Estimate the gas required for the transfer transaction
            const gasResult = await thorClient.transactions.estimateGas(
                clauses,
                actors.sender.address
            );

            // Create transactions
            const transactionBody = {
                chainTag: 0xf6,
                blockRef:
                    latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
                expiration: 32,
                clauses,
                gasPriceCoef: 128,
                gas: gasResult.totalGas,
                dependsOn: null,
                nonce: 23456789
            };

            // 2- Sign transaction

            const signedTransaction = Transaction.of(transactionBody).sign(
                HexUInt.of(actors.sender.privateKey).bytes
            );

            const raw = HexUInt.of(signedTransaction.encoded).toString();

            // 3 - Send raw transaction

            const result = (await RPCMethodsMap(thorClient)[
                RPC_METHODS.eth_sendRawTransaction
            ]([raw])) as string;

            expect(result).toBe(signedTransaction.id.toString());
        });
    });
});
