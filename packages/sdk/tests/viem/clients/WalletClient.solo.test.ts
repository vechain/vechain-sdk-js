import {
    RetrieveExpandedBlock,
    SendTransaction,
    ThorNetworks,
    type TransactionBody
} from '@thor/thorest';
import { ClauseBuilder } from '@thor/thor-client/transactions';
import { Address, BlockRef, Hex, Revision } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';
import { ThorClient } from '../../../src/thor/thor-client/ThorClient';
import { privateKeyToAccount } from 'viem/accounts';
import {
    createWalletClient,
    type PrepareTransactionRequestRequest
} from '@viem/clients';
import { log } from '@common/logging';

/**
 * @group integration/clients
 */
describe('WalletClient SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.at(httpClient);

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const toAddress = '0x435933c8064b4ae76be665428e0307ef2ccfbd68'; // THIS SOLO DEFAULT ACCOUNT[1]

    // TO BE FIXED: DYNAMIC ACCOUNT IS NOT SEEDED YET WHEN THIS TESTS RUNS IN SOLO
    const fromKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36'; // THIS SOLO DEFAULT ACCOUNT[1]

    describe('sendRawTransaction', () => {
        test('ok <- transfer VET', async () => {
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
            const chainTag = await thorClient.nodes.getChainTag();
            const txBody: TransactionBody = {
                chainTag,
                blockRef: BlockRef.of(latestBlock.id).toString(),
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
                network: httpClient.baseURL,
                account
            });
            const tx = walletClient.prepareTransactionRequest(request);
            const raw = await walletClient.signTransaction(tx);
            const txid = (await SendTransaction.of(raw.bytes).askTo(httpClient))
                .response.id;
            log.debug({ message: txid.toString() });
        });
    });

    describe('sendTransaction', () => {
        test('ok <- transfer VET', async () => {
            const latestBlock = (
                await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
            ).response;

            if (latestBlock === undefined || latestBlock === null)
                throw new Error(
                    'Failed to retrieve latest block from Thor network.'
                );

            const chainTag = await thorClient.nodes.getChainTag();
            const request: PrepareTransactionRequestRequest = {
                to: Address.of(toAddress),
                value: Hex.of(10n ** 18n),
                blockRef: BlockRef.of(latestBlock.id),
                chainTag,
                expiration: 32,
                gas: 100000,
                nonce: 8,
                gasPriceCoef: 0
            } satisfies PrepareTransactionRequestRequest;

            const account = privateKeyToAccount(`0x${fromKey}`);
            const walletClient = createWalletClient({
                network: httpClient.baseURL,
                account
            });
            const txid = await walletClient.sendTransaction(request);
            log.debug({ message: txid.toString() });
        });
    });
});
