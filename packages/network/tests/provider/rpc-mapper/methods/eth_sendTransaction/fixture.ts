import { THOR_SOLO_SEEDED_ACCOUNTS } from '@vechain/sdk-solo-setup';

/**
 * Thor solo accounts to use in the tests
 */
const THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = {
    sender: THOR_SOLO_SEEDED_ACCOUNTS[5],
    receiver: THOR_SOLO_SEEDED_ACCOUNTS[6]
};

/**
 * Fixture for a gasPayer private key
 */
const gasPayerPrivateKeyFixture = THOR_SOLO_SEEDED_ACCOUNTS[4].privateKey;

export {
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE,
    gasPayerPrivateKeyFixture
};
