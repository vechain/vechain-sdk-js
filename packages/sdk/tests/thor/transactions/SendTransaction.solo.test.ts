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
    TXID,
    ClauseBuilder
} from '@thor';
import { Address, BlockRef, HexUInt, Revision } from '@vcdm';
import { Transaction, type TransactionBody } from '@thor/model';
import { SOLO_NETWORK } from '@utils';
import { expect, test } from '@jest/globals';

/**
 * @group integration/transactions
 */
describe('RetrieveTransactionReceipt SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const toAddress = '0x435933c8064b4ae76be665428e0307ef2ccfbd68'; // THIS SOLO DEFAULT ACCOUNT[1]

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const fromKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'; // THIS SOLO DEFAULT ACCOUNT[1]

    test('ok <- transfer VET', async () => {
        const transferClause = ClauseBuilder.transferVET(
            Address.of(toAddress),
            10n ** 18n
        );

        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;

        const expectedTxBody: TransactionBody = {
            chainTag: SOLO_NETWORK.chainTag,
            blockRef:
                latestBlock !== null
                    ? BlockRef.of(latestBlock.id).toString()
                    : '0x0',
            expiration: 32,
            clauses: [transferClause],
            gasPriceCoef: 0,
            gas: 100000,
            dependsOn: null,
            nonce: 8
        };

        const signedTx = Transaction.of(expectedTxBody).sign(
            HexUInt.of(fromKey).bytes
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
