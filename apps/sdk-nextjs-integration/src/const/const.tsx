import { ThorClient } from '@vechain/sdk-network';

/**
 * Url of the VeChain mainnet
 */
const mainnetUrl = 'https://mainnet.vechain.org';

/**
 * Thor client instance
 */
const thorClient = ThorClient.at(mainnetUrl);

/**
 * Explorer url
 */
const explorerUrl = 'https://explore.vechain.org';

export { thorClient, explorerUrl };
