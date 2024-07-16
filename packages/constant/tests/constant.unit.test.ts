import { describe, expect, test } from '@jest/globals';
import {
    BUILT_IN_CONTRACTS,
    MAINNET_URL,
    TESTNET_URL,
    THOR_SOLO_ACCOUNTS,
    THOR_SOLO_URL
} from '../src';

/**
 * Constant unit tests
 *
 * @group unit/constant
 */
describe('Tests constants', () => {
    /**
     * Built in constants
     */
    describe('Built in', () => {
        /**
         * Built in constants
         */
        test('Built in constants', () => {
            // Main object
            expect(BUILT_IN_CONTRACTS).toBeDefined();

            // Sub objects
            expect(BUILT_IN_CONTRACTS.ENERGY_ABI).toBeDefined();
            expect(BUILT_IN_CONTRACTS.PARAMS_ABI).toBeDefined();
            expect(BUILT_IN_CONTRACTS.PARAMS_ADDRESS).toBeDefined();
            expect(BUILT_IN_CONTRACTS.ENERGY_ADDRESS).toBeDefined();
        });
    });

    /**
     * Network constants
     */
    describe('Network', () => {
        /**
         * Network constants
         */
        test('Network constants', () => {
            expect(MAINNET_URL).toBeDefined();
            expect(TESTNET_URL).toBeDefined();
            expect(THOR_SOLO_URL).toBeDefined();
        });
    });

    /**
     * Thor solo constants
     */
    describe('Thor solo', () => {
        /**
         * Thor solo constants
         */
        test('Thor solo constants', () => {
            expect(THOR_SOLO_ACCOUNTS).toBeDefined();
        });
    });
});
