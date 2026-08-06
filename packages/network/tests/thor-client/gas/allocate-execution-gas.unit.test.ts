import { describe, expect, test } from '@jest/globals';
import {
    allocateExecutionGas,
    EIP150_DENOMINATOR,
    EIP150_NUMERATOR,
    LEGACY_CONTRACT_INTERACTION_BUFFER
} from '../../../src/thor-client/gas/helpers/allocate-execution-gas';

/**
 * Unit tests for EIP-150-aware execution-gas allocation.
 *
 * @group unit/clients/thor-client/gas
 */
describe('allocateExecutionGas', () => {
    test('Should return 0 when there is no simulated execution gas', () => {
        expect(allocateExecutionGas(0)).toBe(0);
    });

    test('Should keep the legacy +15000 buffer for small contract calls', () => {
        const simulatedGasUsed = 36_518;
        expect(allocateExecutionGas(simulatedGasUsed)).toBe(
            simulatedGasUsed + LEGACY_CONTRACT_INTERACTION_BUFFER
        );
    });

    test('Should switch to ceil(gasUsed * 64/63) once it exceeds the legacy buffer', () => {
        // Legacy buffer wins while gasUsed / 63 ≤ 15000 ⇒ gasUsed ≤ 945000
        const belowThreshold = 945_000;
        expect(allocateExecutionGas(belowThreshold)).toBe(
            belowThreshold + LEGACY_CONTRACT_INTERACTION_BUFFER
        );

        const aboveThreshold = 945_001;
        const eip150Allocation = Math.ceil(
            (aboveThreshold * EIP150_NUMERATOR) / EIP150_DENOMINATOR
        );
        expect(allocateExecutionGas(aboveThreshold)).toBe(eip150Allocation);
        expect(eip150Allocation).toBeGreaterThan(
            aboveThreshold + LEGACY_CONTRACT_INTERACTION_BUFFER
        );
    });

    test('Should reserve enough gas for high-gas proxy claims (StarGate reproduction)', () => {
        // Observed mainnet claimRewards gasUsed through a UUPS proxy.
        // Old formula: 1_444_950 + 15_000 = 1_459_950 → real tx OOG.
        // EIP-150 needs ceil(1_444_950 * 64/63) = 1_467_886.
        const claimGasUsed = 1_444_950;
        const allocated = allocateExecutionGas(claimGasUsed);

        expect(allocated).toBe(
            Math.ceil((claimGasUsed * EIP150_NUMERATOR) / EIP150_DENOMINATOR)
        );
        expect(allocated).toBe(1_467_886);
        expect(allocated).toBeGreaterThan(
            claimGasUsed + LEGACY_CONTRACT_INTERACTION_BUFFER
        );
    });

    test('Should scale correctly for multi-clause high-gas estimates', () => {
        const perClause = 1_444_950;
        const totalSimulated = perClause * 2;
        const allocated = allocateExecutionGas(totalSimulated);

        expect(allocated).toBe(
            Math.ceil((totalSimulated * EIP150_NUMERATOR) / EIP150_DENOMINATOR)
        );
        // Must exceed the old once-per-tx +15000 buffer by a wide margin.
        expect(allocated - totalSimulated).toBeGreaterThan(
            LEGACY_CONTRACT_INTERACTION_BUFFER
        );
    });
});
