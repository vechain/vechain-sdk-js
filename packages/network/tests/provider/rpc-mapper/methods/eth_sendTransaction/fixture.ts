import { ALL_ACCOUNTS } from '../../../../fixture';

/**
 * Thor solo accounts to use in the tests
 */
const THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = {
    sender: ALL_ACCOUNTS[5],
    receiver: ALL_ACCOUNTS[6]
};

/**
 * Fixture for a delegator private key
 */
const delegatorPrivateKeyFixture = ALL_ACCOUNTS[4].privateKey;

export {
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE,
    delegatorPrivateKeyFixture
};
