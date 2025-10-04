import { TEST_ACCOUNTS } from '../../fixture';
import { HexUInt } from '@common';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { RLPCodec } from '@thor';
import { expect } from '@jest/globals';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

/**
 * @group unit/thor/thorest/signer
 */
describe('RLPCodec', () => {
    // Test data setup
    const mockBlockRef = HexUInt.of('0x1234567890abcdef');
    const mockDependsOn = HexUInt.of(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    );
    const mockGas = 21000n;

    describe('encode/decode clauses', () => {
        test('ok <- no clauses', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });
            const actual = RLPCodec.decode(RLPCodec.encode(expected));
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });
});
