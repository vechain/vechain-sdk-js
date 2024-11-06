import { describe, test } from '@jest/globals';
import {
    THOR_SOLO_URL,
    ThorClient,
    type TracerName,
    type TransactionReceipt
} from '../../../src';
import {
    sendTransactionWithAccountIndex,
    traceContractCallTestnetFixture
} from './fixture-thorest';
import { transfer1VTHOClause } from '../transactions/fixture';

/**
 * Debug endpoints tests on the Solo network.
 * With the solo network we are testing all the tracers,
 * while on testnet we only test the 'call' tracer.
 *
 * @group integration/clients/thor-client/debug-solo
 */
describe('ThorClient - Debug Module - Solo', () => {
    /**
     * ThorClient instance
     */
    let thorSoloClient: ThorClient;

    /**
     * Transactions to debug.
     *
     * Before all tests, we send transactions and then
     * we will use the debug endpoints to debug them.
     */
    const transactions: Array<{
        tracerName: TracerName;
        senderAccountIndex: number;
        txReceipt?: TransactionReceipt | null;
    }> = [];

    /**
     * Tracer-AccountsIndex list.
     * This is necessary to associate the tracer name with the sender account index.
     */
    const tracersAccounts: Array<{
        tracerName: TracerName;
        senderAccountIndex: number;
    }> = [
        { tracerName: '', senderAccountIndex: 7 },
        { tracerName: '4byte', senderAccountIndex: 8 },
        { tracerName: 'call', senderAccountIndex: 9 },
        { tracerName: 'noop', senderAccountIndex: 10 },
        { tracerName: 'prestate', senderAccountIndex: 11 },
        { tracerName: 'unigram', senderAccountIndex: 12 },
        { tracerName: 'bigram', senderAccountIndex: 13 },
        { tracerName: 'trigram', senderAccountIndex: 14 },
        { tracerName: 'evmdis', senderAccountIndex: 15 },
        { tracerName: 'opcount', senderAccountIndex: 16 },
        { tracerName: null, senderAccountIndex: 17 }
    ];

    /**
     * Get tracer name by account index
     */
    const getTracerNameByAccountIndex = (accountIndex: number): TracerName => {
        return tracersAccounts.find(
            (tracerAccount) => tracerAccount.senderAccountIndex === accountIndex
        )?.tracerName as TracerName;
    };

    /**
     * Get the transaction receipt by account index
     */
    const getTransactionReceiptByAccountIndex = (
        accountIndex: number
    ): TransactionReceipt | null => {
        return transactions.find(
            (transaction) => transaction.senderAccountIndex === accountIndex
        )?.txReceipt as TransactionReceipt | null;
    };

    /**
     * Make the transactions to debug before all tests
     */
    beforeAll(async () => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
        for (const tracerAccount of tracersAccounts) {
            const txReceipt = await sendTransactionWithAccountIndex(
                tracerAccount.senderAccountIndex,
                thorSoloClient
            );
            transactions.push({
                tracerName: tracerAccount.tracerName,
                senderAccountIndex: tracerAccount.senderAccountIndex,
                txReceipt
            });
        }
    }, 50000);

    /**
     * traceTransactionClause tests
     */
    describe('traceTransactionClause', () => {
        /**
         * Test a result of a transaction clause for each kind of trace name
         */
        [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].forEach((accountIndex) => {
            test(`traceTransactionClause - ${getTracerNameByAccountIndex(accountIndex)}`, async () => {
                // Get the transaction receipt
                const txReceipt =
                    getTransactionReceiptByAccountIndex(accountIndex);

                // Debug the transaction clause
                const result =
                    await thorSoloClient.debug.traceTransactionClause(
                        {
                            target: {
                                blockID: txReceipt?.meta.blockID as string,
                                transaction: txReceipt?.meta.txID as string,
                                clauseIndex: 0
                            },
                            config: {}
                        },
                        getTracerNameByAccountIndex(accountIndex)
                    );
                expect(result).toBeDefined();
            }, 10000);
        });
    });

    /**
     * traceContractCall tests
     */
    describe('traceContractCall', () => {
        /**
         * Test a result of a contract call for each kind of trace name
         */
        [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].forEach((accountIndex) => {
            test(`traceContractCall - ${getTracerNameByAccountIndex(accountIndex)}`, async () => {
                // Get the transaction receipt
                const txReceipt =
                    getTransactionReceiptByAccountIndex(accountIndex);

                // Debug the contract call
                const result = await thorSoloClient.debug.traceContractCall(
                    {
                        contractInput: {
                            to: traceContractCallTestnetFixture.positiveCases[0]
                                .to,
                            data: transfer1VTHOClause.data
                        },
                        transactionOptions: {
                            caller: txReceipt?.gasPayer as string,
                            gasPayer: txReceipt?.gasPayer as string
                        },
                        config: {}
                    },
                    getTracerNameByAccountIndex(accountIndex)
                );
                expect(result).toBeDefined();
            });
        }, 10000);
    });
});
