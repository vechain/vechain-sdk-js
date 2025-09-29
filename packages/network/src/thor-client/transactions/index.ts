export * from './types';

// Placeholder for TransactionsModule
export class TransactionsModule {
    async executeCall(...args: unknown[]): Promise<unknown> {
        throw new Error('TransactionsModule.executeCall not implemented');
    }
    
    async executeMultipleClausesCall(...args: unknown[]): Promise<unknown> {
        throw new Error('TransactionsModule.executeMultipleClausesCall not implemented');
    }
    
    async executeTransaction(...args: unknown[]): Promise<unknown> {
        throw new Error('TransactionsModule.executeTransaction not implemented');
    }
    
    async executeMultipleClausesTransaction(...args: unknown[]): Promise<unknown> {
        throw new Error('TransactionsModule.executeMultipleClausesTransaction not implemented');
    }
    
    async getLegacyBaseGasPrice(...args: unknown[]): Promise<unknown> {
        throw new Error('TransactionsModule.getLegacyBaseGasPrice not implemented');
    }
}
