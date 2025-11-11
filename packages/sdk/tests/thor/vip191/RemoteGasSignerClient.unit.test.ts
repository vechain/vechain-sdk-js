import { describe, expect, test } from '@jest/globals';
import { mockHttpClient } from '../../MockHttpClient';
import { RemoteGasSignerClient } from '@thor/vip191/RemoteGasSignerClient';
import { Address, Hex, HexUInt } from '@common/vcdm';
import {
    TransactionRequest,
    type TransactionRequestParam
} from '@thor/thor-client/model/transactions';

// Mock Remote Gas Signer Response JSON including error field for non 200 response
interface MockRemoteGasSignerResponseJSON {
    signature?: string;
    error?: string;
}

// Transaction Request Parameters
const params = {
    gasSponsorshipRequester: Address.of(
        '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
    ),
    gasPayerServiceUrl: new URL('http://localhost:4000'),
    blockRef: HexUInt.of('0x1234567890abcdef'),
    chainTag: 1,
    clauses: [],
    dependsOn: null,
    expiration: 32,
    gas: 25000n,
    gasPriceCoef: undefined,
    nonce: 3,
    maxFeePerGas: 1000000000000000000n,
    maxPriorityFeePerGas: 1000000000000000000n
} satisfies TransactionRequestParam;

/**
 * @group unit
 */
describe('RemoteGasSignerClient UNIT test', () => {
    describe('Response Validation', () => {
        test('err <- non 200 response should throw error', async () => {
            // setup mock http client
            const httpClient = mockHttpClient<MockRemoteGasSignerResponseJSON>(
                { signature: '', error: '400 Bad Request' },
                'post'
            );
            const remoteGasSignerClient = new RemoteGasSignerClient(httpClient);
            // setup transaction request
            const transactionRequest = new TransactionRequest(params);
            // request signature expect error
            await expect(
                remoteGasSignerClient.requestSignature(transactionRequest)
            ).rejects.toThrow('Failed to sign remote gas sponsorship');
        });
        test('err <- invalid response body (no signature field) should throw error', async () => {
            // setup mock http client to not return a signature field
            const httpClient = mockHttpClient<MockRemoteGasSignerResponseJSON>(
                {},
                'post'
            );
            const remoteGasSignerClient = new RemoteGasSignerClient(httpClient);
            // setup transaction request
            const transactionRequest = new TransactionRequest(params);
            // request signature expect error
            await expect(
                remoteGasSignerClient.requestSignature(transactionRequest)
            ).rejects.toThrow('Remote signer did not return a valid response');
        });
        test('err <- Non hex signature should throw error', async () => {
            // setup mock http client to return a non hex signature
            const httpClient = mockHttpClient<MockRemoteGasSignerResponseJSON>(
                { signature: 'non hex value' },
                'post'
            );
            const remoteGasSignerClient = new RemoteGasSignerClient(httpClient);
            // setup transaction request
            const transactionRequest = new TransactionRequest(params);
            // request signature expect error
            await expect(
                remoteGasSignerClient.requestSignature(transactionRequest)
            ).rejects.toThrow('Remote signer returned an invalid signature');
        });
        test('err <- Invalid signature length should throw error', async () => {
            // setup mock http client to return an invalid signature length
            const httpClient = mockHttpClient<MockRemoteGasSignerResponseJSON>(
                { signature: '0x1234' },
                'post'
            );
            const remoteGasSignerClient = new RemoteGasSignerClient(httpClient);
            // setup transaction request
            const transactionRequest = new TransactionRequest(params);
            // request signature expect error
            await expect(
                remoteGasSignerClient.requestSignature(transactionRequest)
            ).rejects.toThrow(
                'Remote signer returned an invalid signature length'
            );
        });
    });
    describe('Valid Response', () => {
        test('ok <- valid response should return signature', async () => {
            // setup mock http client to return a valid signature
            const expectedSignature = Hex.of(
                '0x7fa3c8f91d8b764dbe1a4efb0c9dd2d1a7c51e0f3ab84c56ed9a2d44c7b1e5f8c3b0d77eaa1c4ef2b9d58fa4310dd64c9f70e8ad5c4b2a197d3e4c5b7f8a9c0d1'
            );
            const httpClient = mockHttpClient<MockRemoteGasSignerResponseJSON>(
                {
                    signature: expectedSignature.toString()
                },
                'post'
            );
            const remoteGasSignerClient = new RemoteGasSignerClient(httpClient);
            // setup transaction request
            const transactionRequest = new TransactionRequest(params);
            // request signature expect signature
            const signature =
                await remoteGasSignerClient.requestSignature(
                    transactionRequest
                );
            // expect signature to be defined
            expect(signature).toBeDefined();
            // expect signature to be a valid hex
            expect(Hex.isValid(signature.toString())).toBe(true);
            // expect signature to be the expected signature
            expect(signature.toString()).toEqual(expectedSignature.toString());
        });
    });
});
