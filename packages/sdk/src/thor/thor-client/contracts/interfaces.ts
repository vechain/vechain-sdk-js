/**
 * Shared interfaces for the contracts module
 */
import type { AbiParameter, AbiFunction } from 'abitype';
import type { Address, Revision } from '@common/vcdm';
import type { HttpClient } from '@common/http';
import type { Signer } from '@thor/signer';
import type {
    ContractCallResult,
    ContractTransactionOptions,
    ContractCallOptions,
    SendTransactionResult
} from './types';

// Proper function arguments type using VeChain SDK types
type FunctionArgs = AbiParameter[];

/**
 * Interface for the ContractsModule to avoid circular imports
 */
export interface ContractsModule {
    httpClient: HttpClient;
    thorClient: {
        accounts: unknown;
        gas: unknown;
        logs: unknown;
        nodes: unknown;
        contracts: unknown;
        httpClient: unknown;
    };

    // Contract interaction methods
    executeCall(
        contractAddress: Address,
        functionAbi: AbiFunction,
        functionData: FunctionArgs,
        options?: ContractCallOptions
    ): Promise<ContractCallResult>;

    executeTransaction(
        signer: Signer,
        contractAddress: Address,
        functionAbi: AbiFunction,
        functionData: FunctionArgs,
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult>;

    executeMultipleClausesCall(
        clauses: {
            to: Address;
            data: string;
            value: string;
            contractAddress?: Address;
            functionAbi?: AbiFunction;
            functionData?: FunctionArgs;
        }[],
        options?: { caller?: string; revision?: Revision }
    ): Promise<ContractCallResult[]>;

    executeMultipleClausesTransaction(
        clauses: {
            to: Address;
            data: string;
            value: string;
            contractAddress?: Address;
            functionAbi?: AbiFunction;
            functionData?: FunctionArgs;
        }[],
        signer: Signer,
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult>;

    getLegacyBaseGasPrice(): Promise<string>;

    getPublicClient():
        | {
              call: Function;
              estimateGas: Function;
              createEventFilter: Function;
              getLogs: Function;
              simulateCalls: Function;
              watchEvent: Function;
              thorNetworks: string;
          }
        | undefined;
    getWalletClient():
        | {
              account: { digits: string; sign: number };
              sendTransaction: Function;
              thorNetworks: string;
          }
        | undefined;
}
