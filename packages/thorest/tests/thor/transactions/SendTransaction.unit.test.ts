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
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('ok <- transfer VET', async () => {
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(latestBlock).toBeDefined();
        const transferClause = Clause.transferVET(
            Address.of(TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address),
            VET.of(1)
        );
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
            HexUInt.of(TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey)
                .bytes
        );
        const txid = (
            await SendTransaction.of(signedTx.encoded).askTo(httpClient)
        ).response;
        expect(txid).toBeDefined();
        expect(txid).toBeInstanceOf(TXID);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const getTxResponse = (
            await RetrieveTransactionByID.of(txid.id).askTo(httpClient)
        ).response;
        expect(getTxResponse).toBeDefined();
        expect(getTxResponse).toBeInstanceOf(GetTxResponse);
        expect(getTxResponse?.nonce).toEqual(BigInt(txBody.nonce));
    });
});
