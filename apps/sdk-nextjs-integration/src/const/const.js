"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explorerUrl = exports.thorClient = void 0;
const sdk_network_1 = require("@vechain/sdk-network");
/**
 * Url of the VeChain mainnet
 */
const mainnetUrl = 'https://mainnet.vechain.org';
/**
 * Thor client instance
 */
const thorClient = sdk_network_1.ThorClient.at(mainnetUrl);
exports.thorClient = thorClient;
/**
 * Explorer url
 */
const explorerUrl = 'https://explore.vechain.org';
exports.explorerUrl = explorerUrl;
