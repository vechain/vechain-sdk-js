/**
 * Shared interfaces for the contracts module
 */
import type { Address } from '@common/vcdm';
import type { Signer } from '@thor/signer';
import type {
    ContractCallResult,
    ContractTransactionOptions,
    ContractCallOptions,
    SendTransactionResult
} from './types';

/**
 * Interface for the ContractsModule to avoid circular imports
 */
export interface ContractsModule {
    httpClient: any;
    thorClient: any;

    // Contract interaction methods
    executeCall(
        contractAddress: Address,
        functionAbi: any,
        functionData: unknown[],
        options?: ContractCallOptions
    ): Promise<ContractCallResult>;

    executeTransaction(
        signer: Signer,
        contractAddress: Address,
        functionAbi: any,
        functionData: unknown[],
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult>;

    executeMultipleClausesCall(
        clauses: any[],
        options?: any
    ): Promise<ContractCallResult[]>;

    executeMultipleClausesTransaction(
        clauses: any[],
        signer: Signer,
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult>;

    getLegacyBaseGasPrice(): Promise<string>;

    getPublicClient(): any;
    getWalletClient(): any;
}
