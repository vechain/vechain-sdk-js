import { type TraceReturnType } from '../../../../thor-client';

/**
 * Available tracers for the RPC standard.
 */
type TracerNameRPC = 'call' | 'prestate';

/**
 * Return type for the following RPC endpoints:
 * * debug_traceTransaction
 * * debug_traceCall
 */
type TracerReturnTypeRPC<TracerNameType extends TracerNameRPC> =
    TracerNameType extends 'call' ? CallTracerRPC : PrestateTracerRPC;

/**
 * The return type of the 'call' tracer for the RPC standard.
 */
type CallTracerRPC = TraceReturnType<'call'> & {
    /**
     * Same of the 'call' tracer of VeChain,
     * BUT with the addition of the revertReason field.
     *
     * @note This is not part of the VeChain's 'call' tracer.
     * For this reason, it will have a default value of ''.
     */
    revertReason?: '';
};

/**
 * The return type of the 'prestate' tracer for the RPC standard.
 */
type PrestateTracerRPC = Record<
    string,
    {
        balance: string;
        code?: string;
        storage?: Record<string, string>;

        /**
         * Same of the 'prestate' tracer of VeChain,
         * BUT with the addition of the nonce field.
         * This field substitutes the 'energy' field
         * of the VeChain's 'prestate' tracer.
         *
         * @note This is not part of the VeChain's 'prestate' tracer.
         * For this reason, it will have a default value of 0.
         */
        nonce: 0;
    }
>;

export type {
    TracerReturnTypeRPC,
    TracerNameRPC,
    CallTracerRPC,
    PrestateTracerRPC
};
