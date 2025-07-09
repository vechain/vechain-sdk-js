// Export all items from config
export * from './config';

// Direct exports from configData for better compatibility
export { getConfigData, setConfig } from './config/configData';

// Direct export of AccountDispatcher
export {
    AccountDispatcher,
    type ThorSoloAccount
} from './config/account-dispatcher';

// Direct exports for constants
export {
    THOR_SOLO_CHAIN_TAG,
    THOR_SOLO_SEEDED_VET_AMOUNT,
    THOR_SOLO_SEEDED_VTHO_AMOUNT,
    THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT,
    THOR_SOLO_DEFAULT_BASE_FEE_PER_GAS,
    THOR_SOLO_DEFAULT_MNEMONIC
} from './config/constants';

export { THOR_SOLO_ACCOUNTS_TO_SEED } from './config/accounts';
