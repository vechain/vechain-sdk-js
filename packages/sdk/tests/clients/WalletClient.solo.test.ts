import {
    ClauseBuilder,
    RetrieveExpandedBlock,
    SendTransaction,
    ThorNetworks,
    type TransactionBody
} from '@thor';
import { Address, Hex, Revision } from '@vcdm';
import { FetchHttpClient } from '@http';
import { SOLO_NETWORK } from '@utils';
import { privateKeyToAccount } from 'viem/accounts';
import {
    createWalletClient,
    type PrepareTransactionRequestRequest
} from '@clients';
import { mockHttpClient } from '../MockHttpClient';

/**
 * @group integration/clients
 */
describe('WalletClient SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const toAddress = '0x435933c8064b4ae76be665428e0307ef2ccfbd68'; // THIS SOLO DEFAULT ACCOUNT[1]

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const fromKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'; // THIS SOLO DEFAULT ACCOUNT[1]

    describe('sendRawTransaction', () => {
        test('ok <- sendRawTransaction', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;

            if (latestBlock === undefined || latestBlock === null)
                throw new Error(
                    'Failed to retrieve latest block from Thor network.'
                );

            const transferClause = ClauseBuilder.transferVET(
                Address.of(toAddress),
                10n ** 18n
            );
            const txBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef: latestBlock.id.toString().slice(0, 18),
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8
            };

            const request: PrepareTransactionRequestRequest = {
                to: Address.of(transferClause.to as string),
                value: Hex.of(transferClause.value),
                blockRef: Hex.of(txBody.blockRef),
                chainTag: txBody.chainTag,
                expiration: txBody.expiration,
                gas: txBody.gas as number,
                nonce: txBody.nonce,
                gasPriceCoef: 0
            } satisfies PrepareTransactionRequestRequest;

            const account = privateKeyToAccount(`0x${fromKey}`);
            const walletClient = createWalletClient({
                httpClient: mockHttpClient({}, 'post'),
                account
            });
            const tx = walletClient.prepareTransactionRequest(request);
            const raw = tx.sign(Hex.of(fromKey).bytes).encoded;
            const txid = (await SendTransaction.of(raw).askTo(httpClient))
                .response.id;
            console.log(txid);
        });
    });
});
