import { HttpClient } from '@vechain/sdk-network/dist';

const testnetUrl = 'https://testnet.vechain.org';

/**
 * Url of the solo network fixture
 */
const soloUrl = 'http://localhost:8669';

/**
 * Url of the mainnet fixture
 */
const mainnetUrl = 'https://mainnet.vechain.org';

/**
 * Test Network instance fixture
 */
const testNetwork = new HttpClient(testnetUrl);

/**
 * Main network instance fixture
 */
const mainNetwork = new HttpClient(mainnetUrl);

/**
 * Solo network instance fixture
 */
const soloNetwork = new HttpClient(soloUrl);

/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

export {
    testNetwork,
    mainNetwork,
    soloNetwork,
    testAccount,
    testnetUrl,
    soloUrl,
    mainnetUrl
};
