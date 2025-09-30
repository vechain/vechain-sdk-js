import { Address, Hex } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { Clause, GasModule } from '@thor/thor-client';

/**
 * GasModule intrinsic gas tests
 * @group unit
 */
describe('GasModule Unit Tests', () => {
    describe('computeIntrinsicGas method tests', () => {
        test('should compute intrinsic gas for a VET transfer', () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'),
                    BigInt('0x1000000000000000000'),
                    Hex.of('0x')
                )
            ];

            const result = GasModule.computeIntrinsicGas(clauses);
            expect(result).toBe(21000n);
        });
        test('should compute instrinsic gas for a contract call with data', () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'),
                    BigInt('0x1000000000000000000'),
                    Hex.of('0x00a9059')
                )
            ];
            const result = GasModule.computeIntrinsicGas(clauses);
            expect(result).toBe(21208n);
        });
        test('should compute intrinsic gas for a contract deployment', () => {
            const clauses: Clause[] = [
                new Clause(null, 0n, Hex.of('0x00a9059'))
            ];
            const result = GasModule.computeIntrinsicGas(clauses);
            expect(result).toBe(53208n);
        });
    });
});
