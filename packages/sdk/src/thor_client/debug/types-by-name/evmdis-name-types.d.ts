/**
 * Config for the 'evmdis' name type
 */
type EVMDisNameConfig = Record<string, unknown>;

/**
 * Return type for the 'evmdis' name type
 */
type EVMDisNameReturnType = Array<{
    op: number;
    depth: number;
    result: string[];
    len: number;
}>;

export { type EVMDisNameConfig, type EVMDisNameReturnType };
