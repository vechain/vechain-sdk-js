/**
 * @group integration/transactions
 */
import { FetchHttpClient } from '@http';
import {
    GetTxResponse,
    RetrieveExpandedBlock,
    RetrieveTransactionByID,
    SendTransaction,
    ThorNetworks,
    TXID
} from '@thor';
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
import { expect } from '@jest/globals';

/**
 * @group integration/transactions
 */
describe('RetrieveTransactionReceipt SOLO tests', () => {
    const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } =
        TEST_ACCOUNTS.TRANSACTION;

    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('ok <- transfer VET', async () => {
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(latestBlock).toBeDefined();
        const transferClause = Clause.transferVET(
            Address.of(TRANSACTION_RECEIVER.address),
            VET.of(1)
        );
        const expectedTxBody: TransactionBody = {
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
        const signedTx = Transaction.of(expectedTxBody).sign(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const actualTXID = (
            await SendTransaction.of(signedTx.encoded).askTo(httpClient)
        ).response;
        expect(actualTXID).toBeDefined();
        expect(actualTXID).toBeInstanceOf(TXID);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const actualTx = (
            await RetrieveTransactionByID.of(actualTXID.id).askTo(httpClient)
        ).response;
        expect(actualTx).toBeDefined();
        expect(actualTx).toBeInstanceOf(GetTxResponse);
        expect(actualTx?.nonce).toEqual(BigInt(expectedTxBody.nonce));
    });
});
