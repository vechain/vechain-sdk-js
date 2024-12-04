import { ThorClient } from '@vechain/sdk-network';

/**
 * Thor client instance, using mainnet URL
 */
const thorClient = ThorClient.at('https://mainnet.vechain.org');

/**
 * Explorer url
 */
const explorerUrl = 'https://explore.vechain.org';

export { thorClient, explorerUrl };
