/**
 * @group integration/transactions
 */
import { type HttpClient } from '@http';
import {
    type RegularBlockResponseJSON,
    RetrieveExpandedBlock,
    SendTransaction,
    TXID,
    type TXIDJSON
} from '@thor';
import {
    Address,
    Clause,
    HexUInt,
    Revision,
    SOLO_NETWORK,
    Transaction,
    type TransactionBody,
    VET
} from '@vechain/sdk-core';
import { TEST_ACCOUNTS } from '../../fixture';
import { expect, jest } from '@jest/globals';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const mockHttpClientGET = <T>(response: T): HttpClient => {
    return {
        get: jest.fn().mockReturnValue(response)
    } as unknown as HttpClient;
};

const mockHttpClientPOST = <T>(response: T): HttpClient => {
    return {
        post: jest.fn().mockReturnValue(response)
    } as unknown as HttpClient;
};

const mockResponse = <T>(body: T, status: number): Response => {
    const init: ResponseInit = {
        status,
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    };
    return new Response(fastJsonStableStringify(body), init);
};

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/transactions
 */
describe('RetrieveTransactionReceipt UNIT tests', () => {
    test('ok <- transfer VET', async () => {
        const expectedBlock = {
            number: 88,
            id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e',
            size: 364,
            parentID:
                '0x000000577127e6426fbe5a303755ba64c167f173bb4e9b60156a62bced1551d8',
            timestamp: 1749224420,
            gasLimit: '150000000',
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: '0',
            totalScore: 88,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 1,
            stateRoot:
                '0xe030c534b66bd1c1b156ada9508bd639cdcbeb7ea1e932f4fd998857b3c4f30a',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            isTrunk: true,
            isFinalized: false,
            baseFeePerGas: '0x9184e72a000',
            transactions: []
        } satisfies RegularBlockResponseJSON;
        const expectedTXID = {
            id: '0x6a4ba19bd4ff9e7c4a9d6a5ba81908d649757aecd39f346e5e342fd82994d53c'
        } satisfies TXIDJSON;
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(
                mockHttpClientGET(mockResponse(expectedBlock, 200))
            )
        ).response;
        expect(latestBlock).toBeDefined();
        const transferClause = Clause.transferVET(
            Address.of(TRANSACTION_RECEIVER.address),
            VET.of(1)
        );
        const expectedTxBody: TransactionBody = {
            chainTag: SOLO_NETWORK.chainTag,
            blockRef:
                latestBlock !== null
                    ? latestBlock.id.toString().slice(0, 18)
                    : '0x0',
            expiration: 32,
            clauses: [transferClause],
            gasPriceCoef: 0,
            gas: 100000,
            dependsOn: null,
            nonce: 8
        };
        const signedTx = Transaction.of(expectedTxBody).sign(
            HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
        );
        const actualTXID = (
            await SendTransaction.of(signedTx.encoded).askTo(
                mockHttpClientPOST(mockResponse(expectedTXID, 200))
            )
        ).response;
        expect(actualTXID).toBeDefined();
        expect(actualTXID).toBeInstanceOf(TXID);
        expect(actualTXID.toJSON()).toEqual(expectedTXID);
    });
});
