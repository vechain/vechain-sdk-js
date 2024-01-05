import { HttpClient, ThorClient } from '@vechainfoundation/vechain-sdk-network';

/**
 * Url of the testnet fixture
 */
const testnetUrl = 'https://testnet.vechain.org';

/**
 * Url of the solo network fixture
 */
const soloUrl = 'http://localhost:8669';

/**
 * Network instance fixture
 */
const testNetwork = new HttpClient(testnetUrl);

/**
 * Solo network instance fixture
 */
const soloNetwork = new HttpClient(soloUrl);

/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

/**
 * Thor client testnet instance fixture
 */
const thorClient = new ThorClient(testNetwork);

/**
 * Thor client solo instance fixture
 */
const thorSoloClient = new ThorClient(soloNetwork);

export {
    testnetUrl,
    soloUrl,
    testNetwork,
    soloNetwork,
    testAccount,
    thorClient,
    thorSoloClient
};
