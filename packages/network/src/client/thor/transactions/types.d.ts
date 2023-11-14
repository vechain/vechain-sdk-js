import { type TransactionBody } from '@vechain-sdk/core/src';

/**
 * Transaction Metadata interface.
 *
 * @private
 */
interface TransactionMetadata {
    blockID: string;
    blockNumber: number;
    blockTimestamp: number;
    txID?: string;
    txOrigin?: string;
}

/**
 * Type for transaction events.
 *
 * @private
 */
type TransactionEventsType = Array<{
    address: string;
    topics: string[];
    data: string;
}>;

/**
 * Type for transaction transfers.
 *
 * @private
 */
type TransactionTransfersType = Array<{
    sender: string;
    recipient: string;
    amount: string;
}>;
/**
 * Type for RAW transaction detail.
 * It is the response of `getTransaction` with `raw` set to `true`.
 *
 * @private
 */
interface TransactionDetailRaw {
    raw: string;
    meta: Omit<TransactionMetadata, 'txID' | 'txOrigin'>;
}

/**
 * Type for NO RAW transaction detail.
 * It is the response of `getTransaction` with `raw` set to `false`.
 *
 * @private
 */
type TransactionDetailNoRaw = TransactionBody & {
    id: string;
    origin: string;
    delegator: string | null;
    size: number;
    meta: TransactionMetadata;
};

/**
 * Type for transaction detail.
 *
 * @public
 */
type TransactionDetail = TransactionDetailRaw | TransactionDetailNoRaw;

/**
 * Type for transaction receipt.
 *
 * @public
 */
interface TransactionReceipt {
    gasUsed: number;
    gasPayer: string;
    paid: string;
    reward: string;
    reverted: boolean;
    outputs: [
        {
            contractAddress: string | null;
            events: TransactionEventsType;
            transfers: TransactionTransfersType;
        }
    ];
    meta: TransactionMetadata;
}

/**
 * Type for transaction call simulation.
 *
 * @public
 */
type TransactionCallSimulation = [
    {
        data: string;
        events: TransactionEventsType;
        transfers: TransactionTransfersType;
        gasUsed: number;
        reverted: boolean;
        vmError: string;
    }
];

/**
 * Type for transaction send result.
 *
 * @public
 */
interface TransactionSendResult {
    id: string;
}

export {
    type TransactionReceipt,
    type TransactionDetail,
    type TransactionCallSimulation,
    type TransactionSendResult
};
