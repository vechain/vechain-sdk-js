import { TEST_ACCOUNTS_THOR_SOLO } from '../../../fixture';

/**
 * Thor solo accounts to use in the tests
 */
const THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = {
    sender: TEST_ACCOUNTS_THOR_SOLO[5],
    receiver: TEST_ACCOUNTS_THOR_SOLO[6]
};

/**
 * Fixture for a delegator private key
 */
const delegatorPrivateKeyFixture = TEST_ACCOUNTS_THOR_SOLO[4].privateKey;

export {
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE,
    delegatorPrivateKeyFixture
};
