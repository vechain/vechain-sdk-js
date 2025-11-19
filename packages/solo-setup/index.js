"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.THOR_SOLO_ACCOUNTS_TO_SEED = exports.THOR_SOLO_DEFAULT_MNEMONIC = exports.THOR_SOLO_DEFAULT_BASE_FEE_PER_GAS = exports.THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT = exports.THOR_SOLO_SEEDED_VTHO_AMOUNT = exports.THOR_SOLO_SEEDED_VET_AMOUNT = exports.AccountDispatcher = exports.setConfig = exports.getConfigData = void 0;
// Export all items from config
__exportStar(require("./config"), exports);
// Direct exports from configData for better compatibility
var configData_1 = require("./config/configData");
Object.defineProperty(exports, "getConfigData", { enumerable: true, get: function () { return configData_1.getConfigData; } });
Object.defineProperty(exports, "setConfig", { enumerable: true, get: function () { return configData_1.setConfig; } });
// Direct export of AccountDispatcher
var account_dispatcher_1 = require("./config/account-dispatcher");
Object.defineProperty(exports, "AccountDispatcher", { enumerable: true, get: function () { return account_dispatcher_1.AccountDispatcher; } });
// Direct exports for constants
var constants_1 = require("./config/constants");
Object.defineProperty(exports, "THOR_SOLO_SEEDED_VET_AMOUNT", { enumerable: true, get: function () { return constants_1.THOR_SOLO_SEEDED_VET_AMOUNT; } });
Object.defineProperty(exports, "THOR_SOLO_SEEDED_VTHO_AMOUNT", { enumerable: true, get: function () { return constants_1.THOR_SOLO_SEEDED_VTHO_AMOUNT; } });
Object.defineProperty(exports, "THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT", { enumerable: true, get: function () { return constants_1.THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT; } });
Object.defineProperty(exports, "THOR_SOLO_DEFAULT_BASE_FEE_PER_GAS", { enumerable: true, get: function () { return constants_1.THOR_SOLO_DEFAULT_BASE_FEE_PER_GAS; } });
Object.defineProperty(exports, "THOR_SOLO_DEFAULT_MNEMONIC", { enumerable: true, get: function () { return constants_1.THOR_SOLO_DEFAULT_MNEMONIC; } });
var accounts_1 = require("./config/accounts");
Object.defineProperty(exports, "THOR_SOLO_ACCOUNTS_TO_SEED", { enumerable: true, get: function () { return accounts_1.THOR_SOLO_ACCOUNTS_TO_SEED; } });
