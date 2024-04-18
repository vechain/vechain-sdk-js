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
    accounts: {
        mnemonic: string;
        count: number;
    };

    /**
     *
     * Delegator configuration
     */
    delegator?: SignTransactionOptions;

    /**
     * Enable delegation
     */
    enbaleDelegation?: boolean;
}

/**
 * Interface for the request body object that is sent to the proxy
 */
interface RequestBody {
    method: string;
    id: string;
}

export type { Config, RequestBody };
