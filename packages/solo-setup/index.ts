// Export all items from config
export * from './config';

// Direct exports from configData for better compatibility
export { getConfigData, setConfig } from './config/configData';

// Direct export of AccountDispatcher
export { AccountDispatcher, type ThorSoloAccount } from './config/account-dispatcher';
