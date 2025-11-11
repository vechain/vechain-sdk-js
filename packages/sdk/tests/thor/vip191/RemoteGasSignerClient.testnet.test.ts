import { FetchHttpClient } from '@common/http';
import { Address, Hex, HexUInt } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import {
    Clause,
    TransactionRequest,
    type TransactionRequestParam
} from '@thor/thor-client/model/transactions';
import { RemoteGasSignerClient } from '@thor/vip191/RemoteGasSignerClient';

/**
 * @group testnet
 */
describe('RemoteGasSignerClient TESTNET test', () => {
    test('ok <- should be able to get a signature from vechain energy', async () => {
        // setup transaction request parameters
        // - sender is 1st solo account mnemonic
        // - recipient is the 2nd solo account mnemonic
        // - vechain energy account is the gas payer
        const params = {
            gasSponsorshipRequester: Address.of(
                '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
            ),
            gasPayerServiceUrl: new URL(
                'https://sponsor-testnet.vechain.energy/by/883' // vechain energy account
            ),
            blockRef: HexUInt.of('0x1234567890abcdef'),
            chainTag: 0x27,
            clauses: [
                new Clause(
                    Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68'),
                    1n
                )
            ],
            dependsOn: null,
            expiration: 32,
            gas: 25000n,
            gasPriceCoef: 0n,
            nonce: 3
        } satisfies TransactionRequestParam;
        const transactionRequest = new TransactionRequest(params);
        // create http clients
        const httpClient = FetchHttpClient.at(params.gasPayerServiceUrl);
        const remoteGasSignerClient = new RemoteGasSignerClient(httpClient);
        // request signature
        const signature =
            await remoteGasSignerClient.requestSignature(transactionRequest);
        // expect signature to be defined
        expect(signature).toBeDefined();
        // expect signature to be a valid hex
        expect(Hex.isValid(signature.toString())).toBe(true);
    });
});
