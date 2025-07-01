// Local type declarations for @vechain/sdk-thorest-api
// This allows TypeScript compilation in CI where peer dependencies aren't installed

declare module '@vechain/sdk-thorest-api' {
  // Block types
  export interface RegularBlockResponse {
    id: string;
    number: number;
    size: number;
    parentID: string;
    timestamp: number;
    gasLimit: number;
    gasUsed: number;
    totalScore: number;
    txsRoot: string;
    txsFeatures: number;
    stateRoot: string;
    receiptsRoot: string;
    signer: string;
    transactions: string[];
    [key: string]: any;
  }

  // HTTP Client
  export class FetchHttpClient {
    static at(baseURL: string): FetchHttpClient;
    get(path?: { path: string }, query?: { query: string }): Promise<Response>;
    post(path?: { path: string }, query?: { query: string }, body?: unknown): Promise<Response>;
  }

  // Block retrieval
  export class RetrieveRegularBlock {
    static of(revision: any): RetrieveRegularBlock;
    askTo(client: FetchHttpClient): Promise<{ response: RegularBlockResponse | null }>;
  }

  export class RetrieveExpandedBlock {
    static of(revision: any): RetrieveExpandedBlock;
    askTo(client: FetchHttpClient): Promise<{ response: RegularBlockResponse | null }>;
  }

  // Transaction operations
  export class SendTransaction {
    static of(encodedTx: Uint8Array): SendTransaction;
    askTo(client: FetchHttpClient): Promise<{ response: { id: string } }>;
  }

  export class RetrieveTransactionByID {
    static of(txId: string): RetrieveTransactionByID;
    askTo(client: FetchHttpClient): Promise<{ response: any }>;
  }
} 