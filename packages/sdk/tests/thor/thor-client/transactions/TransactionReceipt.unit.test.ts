import { Address } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { TransactionReceipt } from '@thor/thor-client/model';
import { type GetTxReceiptResponseJSON } from '@thor/thorest/json';
import { GetTxReceiptResponse } from '@thor/thorest/transactions';

// test transaction receipt
const testTxReceipt = {
    type: null,
    gasUsed: '44794',
    gasPayer: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
    paid: '0x26da441abd4d90000',
    reward: '0x2676cda9d5028c000',
    reverted: false,
    outputs: [
        {
            contractAddress: null,
            events: [
                {
                    address: '0x0000000000000000000000000000506172616D73',
                    topics: [
                        '0x28e3246f80515f5c1ed987b133ef2f193439b25acba6a5e69f219e896fc9d179',
                        '0x000000000000000000000000000000000000626173652d6761732d7072696365'
                    ],
                    data: '0x000000000000000000000000000000000000000000000000000009184e72a000'
                }
            ],
            transfers: [
                {
                    sender: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    recipient: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    amount: '1000000000000000000'
                }
            ]
        }
    ],
    meta: {
        blockID:
            '0x00000001c3296a8528ffd0aa29a7f0379887137159817206626cb66b3760b4a3',
        blockNumber: 1,
        blockTimestamp: 1749136341,
        txID: '0x49144f58b7e5c0341573d68d3d69922ac017983ba07229d5c545b65a386759f1',
        txOrigin: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'
    }
} satisfies GetTxReceiptResponseJSON;

/**
 * @group unit
 */
describe('TransactionReceipt UNIT tests', () => {
    describe('can convert from thorest response', () => {
        test('ok <- valid response', () => {
            const getTxReceiptResponse = new GetTxReceiptResponse(
                testTxReceipt
            );
            const transactionReceipt =
                TransactionReceipt.of(getTxReceiptResponse);
            expect(transactionReceipt).toBeDefined();
            expect(transactionReceipt.type).toBeNull();
            expect(transactionReceipt.gasUsed).toEqual(
                BigInt(testTxReceipt.gasUsed)
            );
            expect(transactionReceipt.gasPayer).toEqual(
                Address.of(testTxReceipt.gasPayer)
            );
            expect(transactionReceipt.paid).toEqual(BigInt(testTxReceipt.paid));
            expect(transactionReceipt.reward).toEqual(
                BigInt(testTxReceipt.reward)
            );
            expect(transactionReceipt.reverted).toBe(testTxReceipt.reverted);
            expect(transactionReceipt.outputs.length).toEqual(
                testTxReceipt.outputs.length
            );
            expect(transactionReceipt.meta.blockID.toString()).toEqual(
                testTxReceipt.meta.blockID
            );
            expect(transactionReceipt.meta.blockNumber).toEqual(
                testTxReceipt.meta.blockNumber
            );
            expect(transactionReceipt.meta.blockTimestamp).toEqual(
                testTxReceipt.meta.blockTimestamp
            );
        });
    });
});
