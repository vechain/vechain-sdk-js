/**
 * Config for the 'call' name type
 */
type CallNameConfig = Record<string, unknown>;

/**
 * Return type for the 'call' name type
 */
interface CallNameReturnType {
    from: string;
    gas: string;
    gasUsed: string;
    to: string;
    input: string;
    output: string;
    calls: Array<{
        from: string;
        gas: string;
        gasUsed: string;
        to: string;
        input: string;
        output: string;
        type: string;
    }>;
}

export { type CallNameConfig, type CallNameReturnType };
