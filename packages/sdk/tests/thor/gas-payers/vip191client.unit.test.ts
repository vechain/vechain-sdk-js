import { IllegalArgumentError } from '@common/errors';
import { describe, expect, test } from '@jest/globals';
import { VIP191Client } from '@thor/gas-payers/VIP191Client';
import { mockHttpClient } from '../../MockHttpClient';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';
import { Address, HexUInt } from '@common/vcdm';
import { VIP191Error } from '@common/errors/VIP191Error';

// valid gas payer signature with 65 bytes
const mockedGasPayerResponse = {
    signature:
        '0x6a67a95ba49e8a9ddf50862f8b4f85662eb95e738430ffc3c049bda41d3a656d2618ac0d4be84208501c59e5f57bfa452d05566f8760858b9e5d30fb24945a3800'
};

// mocked transaction request - delegated
const mockedTransactionRequest: TransactionBody = {
    chainTag: 39,
    blockRef: HexUInt.of('0x0166f0d03904eb80'),
    expiration: 32,
    clauses: [],
    gas: 89646n,
    gasPriceCoef: 128n,
    dependsOn: null,
    nonce: 3n,
    reserved: {
        features: 1,
        unused: []
    }
};

// mocked transaction request - not delegated
const mockedTransactionRequestNotDelegated: TransactionBody = {
    chainTag: 39,
    blockRef: HexUInt.of('0x0166f0d03904eb80'),
    expiration: 32,
    clauses: [],
    gas: 89646n,
    gasPriceCoef: 128n,
    dependsOn: null,
    nonce: 3n,
    reserved: {
        features: 0,
        unused: []
    }
};

// mocked sender address
const mockedSenderAddress = Address.of(
    '0xDd493Fa79Efb85Daba2acC3D9e0081220F534EaF'
);

/**
 * @group unit
 */
describe('VIP191Client Unit Tests', () => {
    describe('constructor', () => {
        test('ok <-should create a new VIP191 client', () => {
            const vip191Client = VIP191Client.of('https://vip191.vechain.org');
            expect(vip191Client).toBeInstanceOf(VIP191Client);
            expect(vip191Client.serviceUrl).toEqual(
                new URL('https://vip191.vechain.org')
            );
        });
        test('err <- should throw an error if the URL is invalid', () => {
            expect(() => VIP191Client.of('invalid-url')).toThrow(
                IllegalArgumentError
            );
        });
    });
    describe('requestSignature', () => {
        test('ok <- should request a gas payer signature', async () => {
            const httpClient = mockHttpClient(mockedGasPayerResponse, 'post');
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequest
            );
            const signature = await vip191Client.requestSignature(
                mockedSenderAddress,
                transactionRequest
            );
            expect(signature.toString().toLowerCase()).toBe(
                mockedGasPayerResponse.signature.toLowerCase()
            );
        });
        test('err <- should throw error if HTTP response is not ok', async () => {
            const httpClient = mockHttpClient(
                { error: 'Failed to sign remote gas sponsorship', code: 400 },
                'post'
            );
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequest
            );
            await expect(
                vip191Client.requestSignature(
                    mockedSenderAddress,
                    transactionRequest
                )
            ).rejects.toThrow(VIP191Error);
        });
        test('err <- should throw error if response does not contain signature field', async () => {
            const httpClient = mockHttpClient({ foo: 'bar' }, 'post');
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequest
            );
            await expect(
                vip191Client.requestSignature(
                    mockedSenderAddress,
                    transactionRequest
                )
            ).rejects.toThrow(VIP191Error);
        });
        test('err <- should throw error if signature is not a string', async () => {
            const httpClient = mockHttpClient({ signature: 123 }, 'post');
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequest
            );
            await expect(
                vip191Client.requestSignature(
                    mockedSenderAddress,
                    transactionRequest
                )
            ).rejects.toThrow(VIP191Error);
        });
        test('err <- should throw error if response contains non hex signature', async () => {
            const httpClient = mockHttpClient({ signature: 'foo' }, 'post');
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequest
            );
            await expect(
                vip191Client.requestSignature(
                    mockedSenderAddress,
                    transactionRequest
                )
            ).rejects.toThrow(VIP191Error);
        });
        test('err <- should throw error if response contains invalid signature length', async () => {
            const httpClient = mockHttpClient({ signature: '0xabc' }, 'post');
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequest
            );
            await expect(
                vip191Client.requestSignature(
                    mockedSenderAddress,
                    transactionRequest
                )
            ).rejects.toThrow(VIP191Error);
        });
        test('err <- should throw error if transaction is not delegated', async () => {
            const httpClient = mockHttpClient(mockedGasPayerResponse, 'post');
            const vip191Client = new VIP191Client(httpClient);
            const transactionRequest = TransactionRequest.of(
                mockedTransactionRequestNotDelegated
            );
            await expect(
                vip191Client.requestSignature(
                    mockedSenderAddress,
                    transactionRequest
                )
            ).rejects.toThrow(VIP191Error);
        });
    });
});
