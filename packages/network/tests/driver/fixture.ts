import { HttpClient } from '../../src';

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
const network = new HttpClient(_testnetUrl);

/**
 * Solo network instance fixture
 */
const soloNetwork = new HttpClient(_soloUrl);

/**
 * First testnet block fixture
 */
const testnetGenesisBlock = {
    number: 0,
    id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    size: 170,
    parentID:
        '0xffffffff00000000000000000000000000000000000000000000000000000000',
    timestamp: 1530014400,
    gasLimit: 10000000,
    beneficiary: '0x0000000000000000000000000000000000000000',
    gasUsed: 0,
    totalScore: 0,
    txsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot:
        '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: '0x0000000000000000000000000000000000000000',
    isTrunk: true,
    isFinalized: true,
    transactions: []
};

/**
 * Zero address account details fixture
 */
const zeroAddressAccountDetails = {
    balance: '0x0',
    energy: '0x0',
    hasCode: false
};

/**
 * Simple test account fixture
 */
const testAccount = '0x5034aa590125b64023a0262112b98d72e3c8e40e';

/**
 * Simple revision account fixture (can be block number or ID, best block is assumed if omitted)
 */
const revision = '100';

/**
 * Zero address fixture
 */
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export {
    network,
    soloNetwork,
    testnetGenesisBlock,
    testAccount,
    revision,
    zeroAddressAccountDetails,
    ZERO_ADDRESS
};
