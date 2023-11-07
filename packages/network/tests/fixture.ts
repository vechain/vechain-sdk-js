import { HttpClient, ThorClient } from '../src';

/**
 * Url of the testnet fixture
 */
const _testnetUrl = 'https://testnet.vechain.org';

/**
 * Url of the solo network fixture
 */
const _soloUrl = 'http://localhost:8669';

/**
 * Network instance fixture
 */
const testNetwork = new HttpClient(_testnetUrl);

/**
 * Solo network instance fixture
 */
const soloNetwork = new HttpClient(_soloUrl);

/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

/**
 * Zero address fixture
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Thor client instance fixture
 */
const thorClient = new ThorClient(testNetwork);

export { testNetwork, soloNetwork, ZERO_ADDRESS, testAccount, thorClient };
