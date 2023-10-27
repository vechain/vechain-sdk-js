import { type Block, type BlockVisitor } from './block';
import { type TransactionVisitor } from './transaction';
import { type VMClause, type VMExplainer } from './vm';
import { type ThorFilter, type FilterCriteria } from './filter';
import { type AccountVisitor } from './account';

/** the interface of Thor module, for accessing VeChain accounts/blocks/txs/logs etc. */
interface Thor {
    /** the genesis block */
    readonly genesis: Block;
    /** current status of VeChain */
    readonly status: ThorStatus;

    /** create a ticker to watch new blocks */
    ticker: () => Ticker;

    /**
     * create a visitor to the account specified by the given address
     * @param addr account address
     */
    account: (addr: string) => AccountVisitor;

    /**
     * create a visitor to the block specified by the given revision
     * @param revision block id or number, defaults to current value of status.head.id
     */
    block: (revision?: string | number) => BlockVisitor;

    /**
     * create a visitor to the transaction specified by the given id
     * @param id tx id
     */
    transaction: (id: string) => TransactionVisitor;

    /** create an event logs filter */
    filterEvent: (
        kind: 'event',
        criteria: Array<FilterCriteria<'event'>>
    ) => ThorFilter<'event'>;

    /** create an transfer logs filter */
    filterTransfer: (
        kind: 'transfer',
        criteria: Array<FilterCriteria<'transfer'>>
    ) => ThorFilter<'transfer'>;

    /** create an explainer to simulate tx execution */
    explain: (clauses: VMClause[]) => VMExplainer;
}

/** describes the status of VeChain */
interface ThorStatus {
    /** progress of synchronization. From 0 to 1, 1 means fully synchronized. */
    progress: number;
    /** summary of head block */
    head: {
        /** block id */
        id: string;
        /** block number */
        number: number;
        /** block timestamp */
        timestamp: number;
        /** parent block id */
        parentID: string;
        /** bits of supported txs features */
        txsFeatures?: number;
        /** block gas limit */
        gasLimit: number;
    };
    /** id of finalized block */
    finalized: string;
}

/** the ticker interface, to watch new blocks */
interface Ticker {
    /** returns a Promise of new head block summary, which is resolved once a new block produced */
    next: () => Promise<ThorStatus['head']>;
}

export type { Thor, ThorStatus };
