import { type SignTransactionOptions } from '@vechain/sdk-network';

/**
 * Interface for the configuration object loaded from the config.json file
 */
interface Config {
    /**
     * Port to run the proxy on
     */
    port?: number;

    /**
     * URL of the blockchain node
     */
    url: string;

    /**
     * Accounts to use for signing transactions
     */
    accounts:
        | {
              mnemonic: string;
              count: number;
              initialIndex: number;
          }
        | string[];

    /**
     *
     * Gas-payer configuration
     */
    gasPayer?: SignTransactionOptions;

    /**
     * Enable verbose logging
     */
    verbose?: boolean;

    /**
     * Enable delegation
     */
    enableDelegation?: boolean;
}

/**
 * Interface for the request body object that is sent to the proxy
 */
interface RequestBody {
    method: string;
    id: string;
    params?: unknown[];
}

export type { Config, RequestBody };
