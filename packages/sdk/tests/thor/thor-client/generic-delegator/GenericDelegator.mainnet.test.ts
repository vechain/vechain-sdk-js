import { Hex, Revision } from '@common';
import { describe, expect, test } from '@jest/globals';
import {
    ClauseBuilder,
    ThorClient,
    TransactionBuilder,
    TransactionRequest
} from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';

/**
 * @group mainnet
 */
describe('GenericDelegator mainnet tests', () => {
    test('Generic delegator can estimate the cost of a transaction', async () => {
        const thorClient = ThorClient.at(ThorNetworks.MAINNET);
        const clause = ClauseBuilder.transferVTHO(
            '0x0000000000000000000000000000000000000000',
            1n
        );
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses([clause])
            .withDynFeeTxDefaults()
            .withEstimatedGas('0x0000000000000000000000000000000000000000', {
                revision: Revision.BEST
            })
            .build();
        const encodedTx = transaction.encoded;
        // send to genreic delegator to estimate b3tr cost
        const response = await fetch(
            'https://mainnet.delegator.vechain.org/api/v1/estimate/transaction/b3tr?type=dynamic&speed=high',
            {
                method: 'POST',
                body: JSON.stringify({
                    raw: encodedTx.toString(),
                    origin: '0x0000000000000000000000000000000000000000'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        expect(response.status).toBe(200);
    });
    test('SDK can decode the generic delegator sign response', async () => {
        const thorClient = ThorClient.at(ThorNetworks.MAINNET);
        const clause = ClauseBuilder.transferVTHO(
            '0x0000000000000000000000000000000000000000',
            1n
        );
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses([clause])
            .withDynFeeTxDefaults()
            .withEstimatedGas('0x0000000000000000000000000000000000000000', {
                revision: Revision.BEST
            })
            .build();
        const encodedTx = transaction.encoded;
        // send to genreic delegator to estimate vet cost
        const response = await fetch(
            'https://mainnet.delegator.vechain.org/api/v1/sign/transaction/vet',
            {
                method: 'POST',
                body: JSON.stringify({
                    raw: encodedTx.toString(),
                    origin: '0x0000000000000000000000000000000000000000'
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        const rawTx = data.raw;
        const updatedTx = TransactionRequest.decode(Hex.of(rawTx));
        expect(updatedTx.clauses.length).toBe(2);
    });
});
