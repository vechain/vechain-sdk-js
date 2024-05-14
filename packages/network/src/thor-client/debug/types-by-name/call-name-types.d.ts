/**
 * Config for the 'call' name type
 */
type CallNameConfig = Record<string, unknown>;

/**
 * Return type for the 'call' name type
 */
interface CallNameReturnType {
    /**
     * Transaction parameters
     */
    from: string;
    gas: string;
    gasUsed: string;
    to: string;
    input: string;
    output?: string;

    /**
     * Transaction errors (if any)
     */
    error?: string;

    /**
     * Trace clause type (/debug/tracers endpoint)
     */
    calls?: Array<{
        from: string;
        gas: string;
        gasUsed: string;
        to: string;
        input: string;
        output: string;
        type: string;
    }>;

    /**
     * Trace contract type (/debug/tracers/call endpoint)
     */
    value?: string;
    type?: string;
}

export { type CallNameConfig, type CallNameReturnType };
