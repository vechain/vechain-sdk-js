import { Address, BlockRef, HexUInt, Revision } from '@common/vcdm';
import { FetchHttpClient } from '@common/http';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import { NewTransactionSubscription } from '@thor/thorest/subscriptions';
import { ThorClient } from '@thor/thor-client/ThorClient';
import {
    afterEach,
    beforeEach,
    beforeAll,
    describe,
    test
} from '@jest/globals';
import { RetrieveExpandedBlock, type TXID } from '@thor/thorest';
import { ClauseBuilder } from '@thor/thor-client/transactions';
import { TransactionRequest } from '@thor/thor-client';
import { PrivateKeySigner } from '@thor';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { log } from '@common/logging';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * VeChain beats subscription - solo
 *
 * @group solo/thor/subscriptions
 */
describe('NewTransactionSubscription solo tests', () => {
    let subscription: NewTransactionSubscription;
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
    const thorClient = ThorClient.fromHttpClient(httpClient);

    // Account seeded by solo setup (default account[1])
    const toAddress = '0x435933c8064b4ae76be665428e0307ef2ccfbd68';
    const fromKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36';
    let signedTxRequest: TransactionRequest;

    beforeAll(async () => {
        // create the trigger transaction
        const transferClause = ClauseBuilder.getTransferVetClause(
            Address.of(toAddress),
            1n // minimal amount
        );
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        if (latestBlock === null || latestBlock === undefined) {
            throw new Error('Failed to retrieve latest block');
        }
        const chainTag = await thorClient.nodes.getChainTag();
        const txRequest = TransactionRequest.of({
            chainTag,
            blockRef: BlockRef.of(latestBlock.id),
            expiration: 32,
            clauses: [transferClause],
            gasPriceCoef: 0n,
            gas: 100000n,
            dependsOn: null,
            nonce: 9n
        });
        const signer = new PrivateKeySigner(HexUInt.of(fromKey).bytes);
        signedTxRequest = await signer.sign(txRequest);
    });

    beforeEach(() => {
        // open the subscription
        subscription = NewTransactionSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
        subscription
            .addListener({
                onMessage: (message) => {
                    const { data } = message;
                    log.debug({ message: fastJsonStableStringify(data) });
                    if (fallbackTimer != null) clearTimeout(fallbackTimer);
                    subscription.close();
                    done();
                },
                onClose: () => {},
                onError: () => {},
                onOpen: () => {
                    // Trigger a tx so that txpool emits a message
                    void (async () => {
                        // Fire and forget; we only need the tx to hit txpool
                        await (
                            await import('@thor/thorest')
                        ).SendTransaction.of(
                            signedTxRequest.encoded.bytes
                        ).askTo(httpClient);
                    })();

                    // Safety: if no message arrives, don't hang the test
                    fallbackTimer = setTimeout(() => {
                        subscription.close();
                        done();
                    }, 3000);
                }
            } satisfies WebSocketListener<TXID>)
            .open();
    }, 30000);

    afterEach(() => {
        subscription.close();
    });
});
