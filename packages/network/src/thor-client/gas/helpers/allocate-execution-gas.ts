/**
 * Historical absolute gas buffer previously added to every contract-interaction
 * estimate. Kept as a floor so small transactions keep the same headroom as
 * before this fix.
 */
const LEGACY_CONTRACT_INTERACTION_BUFFER = 15_000;

/**
 * EIP-150 retains 1/64 of the available gas at each CALL / DELEGATECALL /
 * STATICCALL / CALLCODE boundary. Simulation reports the gas *consumed*, which
 * is less than the gas that must be *allocated* so the callee receives enough
 * after the retention (see https://eips.ethereum.org/EIPS/eip-150).
 *
 * For a single nested boundary (the common UUPS / transparent-proxy case):
 * `ceil(gasUsed * 64 / 63)`.
 */
const EIP150_NUMERATOR = 64;
const EIP150_DENOMINATOR = 63;

/**
 * Converts simulated `gasUsed` into the execution-gas budget that must be
 * reserved in the transaction gas limit.
 *
 * Simulation returns how much gas the EVM *consumed*. With nested CALLs
 * (especially `proxy → DELEGATECALL → implementation`), EIP-150 withholds 1/64
 * of the gas at the boundary, so the outer call must be allocated more gas
 * than the reported consumption or the inner call runs out of gas.
 *
 * The previous estimator used a flat `+ 15000` buffer. That is enough only
 * while `gasUsed / 63 ≤ 15000` (≈ `gasUsed ≤ 945_000`). Above that threshold
 * estimates systematically under-reserve and real transactions revert with
 * `out of gas` even though the simulation succeeded.
 *
 * This helper takes the maximum of:
 * - the legacy `gasUsed + 15000` floor (unchanged behaviour for small calls)
 * - `ceil(gasUsed * 64 / 63)` (EIP-150-correct allocation)
 *
 * @param simulatedGasUsed - Sum of `gasUsed` across clause simulations.
 * @returns Gas to add on top of intrinsic gas (0 when there is no execution).
 */
const allocateExecutionGas = (simulatedGasUsed: number): number => {
    if (simulatedGasUsed === 0) {
        return 0;
    }

    const withLegacyBuffer =
        simulatedGasUsed + LEGACY_CONTRACT_INTERACTION_BUFFER;
    const withEip150Headroom = Math.ceil(
        (simulatedGasUsed * EIP150_NUMERATOR) / EIP150_DENOMINATOR
    );

    return Math.max(withLegacyBuffer, withEip150Headroom);
};

export {
    allocateExecutionGas,
    LEGACY_CONTRACT_INTERACTION_BUFFER,
    EIP150_NUMERATOR,
    EIP150_DENOMINATOR
};
