/**
 * Config for the default ('' or null) name type
 */
type DefaultNameConfig = Record<string, unknown>;

/**
 * Return type for the default ('' or null) name type
 */
interface DefaultNameReturnType {
    gas: number;
    failed: boolean;
    returnValue: string;
    structLogs: Array<{
        pc: number;
        op: string;
        gas: number;
        gasCost: number;
        depth: number;
        stack: string[];
    }>;
}

export { type DefaultNameConfig, type DefaultNameReturnType };
