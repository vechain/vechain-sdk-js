"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vechain_transaction_logger_1 = require("./vechain-transaction-logger");
// Create a new logger instance
const logger = new vechain_transaction_logger_1.VechainTransactionLogger('https://testnet.vechain.org/');
// Start logging transactions for the specified address
logger.startLogging('0xc3bE339D3D20abc1B731B320959A96A08D479583');
// Stop logging after one minute
setTimeout(() => {
    logger.stopLogging();
}, 60000);
