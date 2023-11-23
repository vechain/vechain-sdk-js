import { describe, expect, test } from '@jest/globals';
import {
    TEST_ACCOUNTS,
    thorestSoloClient,
    thorSoloClient
} from '../../../fixture';
import { contractBytecode } from './fixture';
import { networkInfo } from '@vechainfoundation/vechain-sdk-core';
import type { TransactionSendResult } from '../../../../src';

/**
 * ThorClient class tests.
 *
 * @NOTE: This test suite run on solo network because it requires to send transactions.
 *
 * @group integration/client/thor/contracts
 */
describe('ThorClient - Contracts', () => {
    describe('getContract', () => {
        test('deployContract', async () => {
            let response: TransactionSendResult;

            const bestBlock = await thorestSoloClient.blocks.getBlock('best');
            try {
                response = await thorSoloClient.contracts.deployContract(
                    contractBytecode,
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                    {
                        chainTag: networkInfo.solo.chainTag,
                        blockRef: bestBlock?.id.slice(0, 18)
                    }
                );

                let transactionReceipt = null;

                while (transactionReceipt == null) {
                    transactionReceipt =
                        await thorestSoloClient.transactions.getTransactionReceipt(
                            response.id
                        );
                }

                expect(transactionReceipt.reverted).toBe(false);
                expect(transactionReceipt.outputs).toHaveLength(1);
                expect(
                    transactionReceipt.outputs[0].contractAddress
                ).toBeDefined();
            } catch (error) {
                console.log('error', error);
            }
        }, 200000);
    });
});
