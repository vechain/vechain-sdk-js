import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import { NewTransactionSubscription } from '@thor/thorest/subscriptions';
import {
    ClauseBuilder,
    RetrieveExpandedBlock,
    ThorNetworks,
    Transaction,
    type TXID
} from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { Address, BlockRef, HexUInt, Revision } from '@common/vcdm';
import { SOLO_NETWORK } from '@thor/utils/const/network';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

/**
 * VeChain beats subscription - integration
 *
 * @group integration/thor/subscriptions
 */
describe('NewTransactionSubscription solo tests', () => {
    let subscription: NewTransactionSubscription;
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    // Account seeded by solo setup (default account[1])
    const toAddress = '0x435933c8064b4ae76be665428e0307ef2ccfbd68';
    const fromKey =
        '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36';
    beforeEach(() => {
        subscription = NewTransactionSubscription.at(
            new MozillaWebSocketClient('ws://localhost:8669')
        );
    });

    test('data <- open', (done) => {
        let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
        subscription
            .addListener({
                onMessage: (message) => {
                    const data = message.data;
                    log.debug(fastJsonStableStringify(data));
                    if (fallbackTimer) clearTimeout(fallbackTimer);
                    subscription.close();
                    done();
                },
                onClose: () => {},
                onError: () => {},
                onOpen: () => {
                    // Trigger a tx so that txpool emits a message
                    void (async () => {
                        const transferClause = ClauseBuilder.transferVET(
                            Address.of(toAddress),
                            1n // minimal amount
                        );

                        const latestBlock = (
                            await RetrieveExpandedBlock.of(Revision.BEST).askTo(
                                httpClient
                            )
                        ).response;

                        const txBody = {
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
                            nonce: 9
                        };

                        const signedTx = Transaction.of(txBody).sign(
                            HexUInt.of(fromKey).bytes
                        );

                        // Fire and forget; we only need the tx to hit txpool
                        await (
                            await import('@thor/thorest')
                        ).SendTransaction.of(signedTx.encoded).askTo(
                            httpClient
                        );
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
