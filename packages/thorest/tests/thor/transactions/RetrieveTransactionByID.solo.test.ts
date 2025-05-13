import { describe, test, expect } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveExpandedBlock,
    RetrieveTransactionByID,
    SendTransaction,
    ThorNetworks
} from '../../../src';
import {
    Address,
    Clause,
    HexUInt,
    Revision,
    SOLO_NETWORK,
    Transaction,
    type TransactionBody,
    VET
} from '@vechain/sdk-core';
import { TEST_ACCOUNTS } from '../../fixture';

/**
 * VeChain transaction - solo
 *
 * @group solo/transaction
 */
describe('RetrieveTransactionByID solo tests', () => {
    const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } =
        TEST_ACCOUNTS.TRANSACTION;

    test('send and retrieve transaction', async () => {
        const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

        const transferClause = Clause.transferVET(
            Address.of(TRANSACTION_RECEIVER.address),
            VET.of(1)
        );

        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;

        const txBody: TransactionBody = {
            chainTag: SOLO_NETWORK.chainTag,
            blockRef:
                latestBlock !== null
                    ? latestBlock.id.toString().slice(0, 18)
                    : '0x0',
            expiration: 32,
            clauses: [transferClause],
            gasPriceCoef: 0,
            gas: 100000,
            dependsOn: null,
            nonce: 8
        };

        const signedTx = Transaction.of(txBody).sign(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );

        const sendResponse = await SendTransaction.of(signedTx.encoded).askTo(
            httpClient
        );

        const txId = sendResponse.response.id;

        await new Promise((resolve) => setTimeout(resolve, 3000));

        const retrieveResponse =
            await RetrieveTransactionByID.of(txId).askTo(httpClient);

        const transaction = retrieveResponse.response;
        const transactionJson = retrieveResponse.response.toJSON();

        expect(transaction.nonce).toEqual(8);
        expect(transactionJson.nonce).toEqual('0x08');
    });
});
