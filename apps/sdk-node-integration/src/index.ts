import { VeChainTransactionLogger } from './vechain-transaction-logger';

const logger = new VeChainTransactionLogger('https://testnet.vechain.org/');
logger.startLogging('0xc3bE339D3D20abc1B731B320959A96A08D479583');

setTimeout(() => logger.stopLogging(), 5000);
