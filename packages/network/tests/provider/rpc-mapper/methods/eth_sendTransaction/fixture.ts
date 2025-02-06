import { THOR_SOLO_ACCOUNTS } from '../../../../../src';

/**
 * Thor solo accounts to use in the tests
 */
const THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = {
    sender: THOR_SOLO_ACCOUNTS[5],
    receiver: THOR_SOLO_ACCOUNTS[6]
};

/**
 * Fixture for a gasPayer private key
 */
const delegatorPrivateKeyFixture = THOR_SOLO_ACCOUNTS[4].privateKey;

export {
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE,
    delegatorPrivateKeyFixture
};
