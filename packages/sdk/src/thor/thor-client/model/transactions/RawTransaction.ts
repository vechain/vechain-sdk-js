import { type HexUInt } from '@common/vcdm';
import { TransactionMeta } from './TransactionMeta';
import { type GetRawTxResponse } from '@thor/thorest/transactions/response';

/**
 * Class representing a raw transaction read from the blockchain.
 */
class RawTransaction {
    /**
     * The raw transaction.
     */
    raw: HexUInt;

    /**
     * The transaction metadata.
     */
    meta: TransactionMeta;

    /**
     * Constructs a new RawTransaction instance.
     * @param raw - The raw transaction hex.
     * @param meta - The transaction metadata.
     */
    constructor(raw: HexUInt, meta: TransactionMeta) {
        this.raw = raw;
        this.meta = meta;
    }

    /**
     * Constructs a new RawTransaction instance from a GetRawTxResponse.
     * @param response - The GetRawTxResponse.
     * @returns The RawTransaction instance.
     */
    static of(response: GetRawTxResponse): RawTransaction {
        return new RawTransaction(
            response.raw,
            new TransactionMeta(response.meta)
        );
    }
}

export { RawTransaction };
