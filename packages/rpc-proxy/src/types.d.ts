import { type SignTransactionOptions } from '@vechain/sdk-network';

/**
 * Interface for the configuration object loaded from the config.json file
 */
interface Config {
    /**
     * Accounts to use for signing transactions
     */
    accounts:
        | {
              mnemonic: string;
              count: number;
          }
        | string[];

    /**
     *
     * Delegator configuration
     */
    delegator?: SignTransactionOptions;

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
}

export type { Config, RequestBody };
