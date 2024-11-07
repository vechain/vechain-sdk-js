import {
    type BigramNameConfig,
    type BigramNameReturnType,
    type CallNameConfig,
    type CallNameReturnType,
    type DefaultNameConfig,
    type DefaultNameReturnType,
    type EVMDisNameConfig,
    type EVMDisNameReturnType,
    type FourByteNameConfig,
    type FourByteNameReturnType,
    type NoopNameConfig,
    type NoopNameReturnType,
    type OPCountNameConfig,
    type OPCountNameReturnType,
    type PreStateNameConfig,
    type PreStateNameReturnType,
    type TrigramNameConfig,
    type TrigramNameReturnType,
    type UnigramNameConfig,
    type UnigramNameReturnType
} from './types-by-name';
import { type SimulateTransactionOptions } from '../transactions/types';

/**
 * TracerName is the name of the tracer to use.
 *
 * It determines Output and Input configuration.
 *
 * An empty name stands for the default struct logger tracer.
 */
type TracerName =
    | ''
    | '4byte'
    | 'call'
    | 'noop'
    | 'prestate'
    | 'unigram'
    | 'bigram'
    | 'trigram'
    | 'evmdis'
    | 'opcount'
    | null;

/**
 * The configuration of the tracer.
 *
 * Used for traceTransactionClause and traceContractCall functions.
 *
 * It is specific to the name of the tracer.
 *
 * @see{TracerName}
 */
type TracerConfig<TraceNameType extends TracerName | undefined> =
    TraceNameType extends ''
        ? DefaultNameConfig
        : TraceNameType extends '4byte'
          ? FourByteNameConfig
          : TraceNameType extends 'call'
            ? CallNameConfig
            : TraceNameType extends 'noop'
              ? NoopNameConfig
              : TraceNameType extends 'prestate'
                ? PreStateNameConfig
                : TraceNameType extends 'unigram'
                  ? UnigramNameConfig
                  : TraceNameType extends 'bigram'
                    ? BigramNameConfig
                    : TraceNameType extends 'trigram'
                      ? TrigramNameConfig
                      : TraceNameType extends 'evmdis'
                        ? EVMDisNameConfig
                        : TraceNameType extends 'opcount'
                          ? OPCountNameConfig
                          : TraceNameType extends null
                            ? DefaultNameConfig
                            : TraceNameType extends undefined
                              ? DefaultNameConfig
                              : never;

/**
 * The return type of the tracer.
 *
 * Used for traceTransactionClause and traceContractCall functions.
 *
 * It is specific to the name of the tracer.
 *
 * @see{TracerName}
 */
type TraceReturnType<TraceNameType extends TracerName | undefined> =
    TraceNameType extends ''
        ? DefaultNameReturnType
        : TraceNameType extends '4byte'
          ? FourByteNameReturnType
          : TraceNameType extends 'call'
            ? CallNameReturnType
            : TraceNameType extends 'noop'
              ? NoopNameReturnType
              : TraceNameType extends 'prestate'
                ? PreStateNameReturnType
                : TraceNameType extends 'unigram'
                  ? UnigramNameReturnType
                  : TraceNameType extends 'bigram'
                    ? BigramNameReturnType
                    : TraceNameType extends 'trigram'
                      ? TrigramNameReturnType
                      : TraceNameType extends 'evmdis'
                        ? EVMDisNameReturnType
                        : TraceNameType extends 'opcount'
                          ? OPCountNameReturnType
                          : TraceNameType extends null
                            ? DefaultNameReturnType
                            : TraceNameType extends undefined
                              ? DefaultNameReturnType
                              : never;

/**
 * Type for input for trace contract call - transaction options.
 */
type ContractTraceOptions = Omit<SimulateTransactionOptions, 'revision'>;

export {
    type TracerName,
    type TracerConfig,
    type TraceReturnType,
    type ContractTraceOptions
};
