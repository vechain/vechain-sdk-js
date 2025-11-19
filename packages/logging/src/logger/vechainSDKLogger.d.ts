import { type LogFunctionType, type LoggerType } from './types';
/**
 * Logger function that returns a log function based on the logger type.
 */
declare const VeChainSDKLogger: <TLoggerType extends LoggerType>(loggerType: TLoggerType) => LogFunctionType<typeof loggerType>;
export { VeChainSDKLogger };
//# sourceMappingURL=vechainSDKLogger.d.ts.map