import { type BlocksModule, type ThorClient, type TransactionsModule } from '../../thor-client';
declare const vnsUtils: {
    resolveName: (thorClient: ThorClient, name: string) => Promise<null | string>;
    resolveNames: (blocksModule: BlocksModule, transactionsModule: TransactionsModule, names: string[]) => Promise<Array<null | string>>;
    lookupAddress: (thorClient: ThorClient, address: string) => Promise<null | string>;
    lookupAddresses: (thorClient: ThorClient, addresses: string[]) => Promise<Array<null | string>>;
};
export { vnsUtils };
//# sourceMappingURL=index.d.ts.map