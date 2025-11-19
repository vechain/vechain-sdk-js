"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToRPCStandard = formatToRPCStandard;
/**
 * Output formatter for RPC debug endpoints:
 * * debug_traceTransaction
 * * debug_traceCall
 * It converts our endpoint calls output to the RPC standard output.
 *
 * @param tracerName - Tracer name used for the debug endpoint.
 * @param debugDetails - Debug details to be formatted.
 */
function formatToRPCStandard(tracerName, debugDetails) {
    if (tracerName === 'call') {
        return {
            ...debugDetails,
            // Empty revert reason
            revertReason: ''
        };
    }
    return Object.fromEntries(Object.entries(debugDetails).map(([key, value]) => {
        const valueWithoutEnergy = {
            balance: value.balance,
            code: value.code,
            storage: value.storage
        };
        return [key, { ...valueWithoutEnergy, nonce: 0 }];
    }));
}
