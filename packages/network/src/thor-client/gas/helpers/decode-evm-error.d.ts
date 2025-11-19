/**
 * Decodes revert reasons from a given hex-encoded data string, identifying whether the revert is due to an "Error(string)" or a "Panic(uint256)".
 *
 * @param data - Hex-encoded data containing revert information.
 * @returns Decoded revert reason or an error message if decoding fails.
 *
 * @example
 * ```typescript
 * const revertReason = decodeRevertReason('0x0123456789abcdef0123456789abcdef');
 * console.log(revertReason); // 'Decoded Revert Reason'
 * ```
 */
declare function decodeRevertReason(data: string): string | undefined;
export { decodeRevertReason };
//# sourceMappingURL=decode-evm-error.d.ts.map