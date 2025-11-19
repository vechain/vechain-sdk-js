"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THOR_SOLO_URL = exports.TESTNET_URL = exports.MAINNET_URL = void 0;
/**
 * Url of the mainnet
 */
const MAINNET_URL = 'https://mainnet.vechain.org';
exports.MAINNET_URL = MAINNET_URL;
/**
 * Url of the testnet
 */
const TESTNET_URL = 'https://testnet.vechain.org';
exports.TESTNET_URL = TESTNET_URL;
/**
 * Url of the solo network
 * Using explicit IPv4 (127.0.0.1) instead of localhost to avoid IPv6 resolution issues in CI
 */
const THOR_SOLO_URL = 'http://127.0.0.1:8669';
exports.THOR_SOLO_URL = THOR_SOLO_URL;
