import { describe, expect, test } from '@jest/globals';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { SendTransaction, type TXIDJSON } from '@thor';
import {
    ABIContract,
    networkInfo,
    type TransactionBody,
    Units
} from '@vechain/sdk-core';
import { BUILT_IN_CONTRACTS } from './built-in';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 * VeChain transaction - unit
 *
 * @group unit/transaction
 */
describe('SendTransaction solo tests', () => {
    const TEST_ACCOUNTS_TRANSACTION_SENDER_PRIVATE_KEY =
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5';

    const TEST_ACCOUNTS_TRANSACTION_TRANSACTION_RECEIVER_ADDRESS =
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39';

    const transfer1VTHOClause = {
        to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
        value: '0',
        data: ABIContract.ofAbi(BUILT_IN_CONTRACTS.ENERGY_ABI)
            .encodeFunctionInput('transfer', [
                TEST_ACCOUNTS_TRANSACTION_TRANSACTION_RECEIVER_ADDRESS,
                Units.parseEther('1').bi
            ])
            .toString()
    };

    const transferTransactionBody: Omit<TransactionBody, 'gas' | 'nonce'> = {
        clauses: [transfer1VTHOClause],
        chainTag: networkInfo.solo.chainTag,
        blockRef: networkInfo.solo.genesisBlock.id.slice(0, 18),
        expiration: 1000,
        gasPriceCoef: 128,
        dependsOn: null
    };

    test('ok <- askTo', async () => {
        const gasResult = {
            totalGas: 21000,
            reverted: false,
            revertReasons: [],
            vmErrors: []
        };

        const TXIDJSON = {
            id: '0x0000000000000000000000000000000000000000000000000000000000000123'
        } satisfies TXIDJSON;

        const tx = Transaction.of({
            ...transferTransactionBody,
            gas: gasResult.totalGas,
            nonce: 10000000,
            gasPriceCoef: 128
        }).sign(
            HexUInt.of(TEST_ACCOUNTS_TRANSACTION_SENDER_PRIVATE_KEY).bytes
        ).encoded;
        const mockClient = mockHttpClient<TXIDJSON>(TXIDJSON, 'post');
        const response = await SendTransaction.of(tx).askTo(mockClient);

        expect(response.response.toJSON()).toEqual(TXIDJSON);
    });
});
