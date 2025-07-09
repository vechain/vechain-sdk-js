import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient
} from '../../../../../src';
import { getReceiptCorrectCasesSoloNetwork } from './fixture';
import { retryOperation } from '../../../../test-utils';

// Remove blockHash and blockNumber fields from the object for comparison
function removeBlockNumAndHashFields(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        return obj.map(removeBlockNumAndHashFields);
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: Record<string, unknown> = {};
        const objRecord = obj as Record<string, unknown>;
        for (const key in objRecord) {
            if (key !== 'blockHash' && key !== 'blockNumber') {
                newObj[key] = removeBlockNumAndHashFields(objRecord[key]);
            }
        }
        return newObj;
    }
    return obj;
}

/**
 * RPC Mapper integration tests for 'eth_getTransactionReceipt' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionReceipt
 */
describe('RPC Mapper - eth_getTransactionReceipt method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * eth_getTransactionReceipt RPC call tests - Positive cases
     */
    describe('eth_getTransactionReceipt - Positive cases', () => {
        /**
         * Positive cases - Solo network
         */
        getReceiptCorrectCasesSoloNetwork.forEach((testCase) => {
            test(
                testCase.testCase,
                async () => {
                    const receipt = await retryOperation(async () => {
                        return await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_getTransactionReceipt
                        ]([testCase.hash]);
                    });
                    const receiptWithoutBlockHash =
                        removeBlockNumAndHashFields(receipt);
                    const expectedWithoutBlockHash =
                        removeBlockNumAndHashFields(testCase.expected);
                    expect(receiptWithoutBlockHash).toEqual(
                        expectedWithoutBlockHash
                    );
                },
                15000
            );
        });
    });
});
