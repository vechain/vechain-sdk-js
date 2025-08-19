/**
 * Config for the 'prestate' name type
 */
type PreStateNameConfig = Record<string, unknown>;

/**
 * Return type for the 'prestate' name type
 */
type PreStateNameReturnType = Record<
    string,
    {
        balance: string;
        energy: string;
        code?: string;
        storage?: Record<string, string>;
    }
>;

export { type PreStateNameConfig, type PreStateNameReturnType };
