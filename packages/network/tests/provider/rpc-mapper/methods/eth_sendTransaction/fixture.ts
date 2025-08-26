import { getUnusedAccount } from '../../../../fixture';

/**
 * Thor solo accounts to use in the tests
 */
const THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = {
    sender: getUnusedAccount(),
    receiver: getUnusedAccount()
};

/**
 * Fixture for a gasPayer private key
 */
const gasPayerPrivateKeyFixture = getUnusedAccount().privateKey;

export {
    THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE,
    gasPayerPrivateKeyFixture
};
