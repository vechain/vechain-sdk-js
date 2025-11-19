import { formatTransactionReceiptToRPCStandard } from './formatter';
export type * from './types.d';
export declare const transactionsFormatter: {
    formatToRPCStandard: (tx: import("../../../..").TransactionDetailNoRaw, chainId: string, txIndex: number) => import("./types.d").TransactionRPC;
    formatExpandedBlockToRPCStandard: (tx: import("../../../..").TransactionsExpandedBlockDetail, block: import("../../../..").ExpandedBlockDetail, txIndex: number, chainId: string) => import("./types.d").TransactionRPC;
    formatTransactionReceiptToRPCStandard: typeof formatTransactionReceiptToRPCStandard;
};
//# sourceMappingURL=index.d.ts.map