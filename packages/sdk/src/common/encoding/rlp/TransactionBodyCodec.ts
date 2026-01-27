import { TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';

/**
 * Base class for encoding and decoding transaction bodies.
 */
class TransactionBodyCodec {
    protected static readonly EMPTY_HEX = '0x'; // RLP encodes as empty byte array
    protected static readonly DYNAMIC_FEE_PREFIX = 0x51;
    protected static readonly FIELDS_COUNT_DYNAMIC_FEE_UNSIGNED = 10;
    protected static readonly FIELDS_COUNT_DYNAMIC_FEE_SIGNED = 11;
    protected static readonly FIELDS_COUNT_LEGACY_UNSIGNED = 9;
    protected static readonly FIELDS_COUNT_LEGACY_SIGNED = 10;

    /**
     * Determines if a transaction body is a dynamic fee transaction.
     * @param body - The transaction body to check.
     * @returns True if the transaction body is a dynamic fee transaction, false otherwise.
     */
    protected static isDynamicFee(body: TransactionBody): boolean {
        return (
            body.maxFeePerGas !== undefined &&
            body.maxFeePerGas > 0n &&
            body.maxPriorityFeePerGas !== undefined &&
            body.maxPriorityFeePerGas >= 0n &&
            body.gasPriceCoef === undefined
        );
    }
}

export { TransactionBodyCodec };
