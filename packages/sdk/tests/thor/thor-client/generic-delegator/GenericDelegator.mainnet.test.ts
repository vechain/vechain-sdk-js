import { Address, Hex, Revision, Secp256k1 } from '@common';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import {
    type Clause,
    ClauseBuilder,
    ThorClient,
    TransactionBuilder,
    TransactionRequest
} from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';

// simple generic delegator client for testing
const genericDelegatorClient = {
    estimate: async (encodedTx: Hex, origin: Address): Promise<Response> => {
        return fetch(
            'https://mainnet.delegator.vechain.org/api/v1/estimate/transaction/b3tr?type=dynamic&speed=high',
            {
                method: 'POST',
                body: JSON.stringify({
                    raw: encodedTx.toString(),
                    origin: origin.toString()
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    },
    sign: async (encodedTx: Hex, origin: Address): Promise<Response> => {
        return fetch(
            'https://mainnet.delegator.vechain.org/api/v1/sign/transaction/vet',
            {
                method: 'POST',
                body: JSON.stringify({
                    raw: encodedTx.toString(),
                    origin: origin.toString()
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
};

/**
 * @group mainnet
 */
describe('GenericDelegator mainnet tests', () => {
    let thorClient: ThorClient;
    let clause: Clause;
    beforeAll(() => {
        thorClient = ThorClient.at(ThorNetworks.MAINNET);
        clause = ClauseBuilder.transferVTHO(
            '0x0000000000000000000000000000000000000000',
            1n
        );
    });
    describe('Estimate transaction cost', () => {
        test('ok <- unsigned - delegated - dynamic fee transaction', async () => {
            const builder = TransactionBuilder.create(thorClient);
            const transaction = await builder
                .withClauses([clause])
                .withDynFeeTxDefaults()
                .withDelegatedFee()
                .withEstimatedGas(
                    '0x0000000000000000000000000000000000000000',
                    {
                        revision: Revision.BEST
                    }
                )
                .build();
            const encodedTx = transaction.encoded;
            // send to genreic delegator
            const response = await genericDelegatorClient.estimate(
                encodedTx,
                Address.of('0x0000000000000000000000000000000000000000')
            );
            // assert GD could decode the transaction
            expect(response.status).toBe(200);
        });
        test('ok <- unsigned - delegated - legacy transaction', async () => {
            const builder = TransactionBuilder.create(thorClient);
            const transaction = await builder
                .withClauses([clause])
                .withLegacyTxDefaults()
                .withDelegatedFee()
                .withEstimatedGas(
                    '0x0000000000000000000000000000000000000000',
                    {
                        revision: Revision.BEST
                    }
                )
                .build();
            const encodedTx = transaction.encoded;
            // send to genreic delegator
            const response = await genericDelegatorClient.estimate(
                encodedTx,
                Address.of('0x0000000000000000000000000000000000000000')
            );
            // assert GD could decode the transaction
            expect(response.status).toBe(200);
        });
        test('ok <- signed by origin- delegated - dynamic fee transaction', async () => {
            const soloConfig = getConfigData();
            const sender = Address.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]
            );
            const senderPrivateKey = Hex.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
            );
            const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
            const builder = TransactionBuilder.create(thorClient);
            const transaction = await builder
                .withClauses([clause])
                .withDynFeeTxDefaults()
                .withDelegatedFee()
                .withEstimatedGas(sender, {
                    revision: Revision.BEST
                })
                .build();
            const signedTx = senderSigner.sign(transaction);
            const encodedTx = signedTx.encoded;
            // send to genreic delegator
            const response = await genericDelegatorClient.estimate(
                encodedTx,
                sender
            );
            // assert GD could decode the transaction
            expect(response.status).toBe(200);
        });
        test('ok <- signed by origin- delegated - legacy transaction', async () => {
            const soloConfig = getConfigData();
            const sender = Address.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]
            );
            const senderPrivateKey = Hex.of(
                soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
            );
            const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
            const builder = TransactionBuilder.create(thorClient);
            const transaction = await builder
                .withClauses([clause])
                .withLegacyTxDefaults()
                .withDelegatedFee()
                .withEstimatedGas(sender, {
                    revision: Revision.BEST
                })
                .build();
            const signedTx = senderSigner.sign(transaction);
            const encodedTx = signedTx.encoded;
            // send to genreic delegator
            const response = await genericDelegatorClient.estimate(
                encodedTx,
                sender
            );
            // assert GD could decode the transaction
            expect(response.status).toBe(200);
        });
    });
    describe('Sign transaction', () => {
        test('ok <- unsigned - delegated - dynamic fee transaction', async () => {
            const builder = TransactionBuilder.create(thorClient);
            const transaction = await builder
                .withClauses([clause])
                .withDynFeeTxDefaults()
                .withDelegatedFee()
                .withEstimatedGas(
                    '0x0000000000000000000000000000000000000000',
                    {
                        revision: Revision.BEST
                    }
                )
                .build();
            const encodedTx = transaction.encoded;
            // send to genreic delegator to estimate vet cost
            const response = await genericDelegatorClient.sign(
                encodedTx,
                Address.of('0x0000000000000000000000000000000000000000')
            );
            expect(response.status).toBe(200);
            const data = await response.json();
            const rawTx = data.raw;
            const updatedTx = TransactionRequest.decode(Hex.of(rawTx));
            expect(updatedTx.isDelegated).toBe(true);
            expect(updatedTx.clauses.length).toBe(2);
        });
        test('ok <- unsigned - delegated - legacy transaction', async () => {
            const builder = TransactionBuilder.create(thorClient);
            const transaction = await builder
                .withClauses([clause])
                .withLegacyTxDefaults()
                .withDelegatedFee()
                .withEstimatedGas(
                    '0x0000000000000000000000000000000000000000',
                    {
                        revision: Revision.BEST
                    }
                )
                .build();
            const encodedTx = transaction.encoded;
            // send to genreic delegator
            const response = await genericDelegatorClient.sign(
                encodedTx,
                Address.of('0x0000000000000000000000000000000000000000')
            );
            // assert GD could decode the transaction
            expect(response.status).toBe(200);
            const data = await response.json();
            const rawTx = data.raw;
            const updatedTx = TransactionRequest.decode(Hex.of(rawTx));
            expect(updatedTx.isDelegated).toBe(true);
            expect(updatedTx.clauses.length).toBe(2);
        });
    });
});
