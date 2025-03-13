import { Address, Token, Units } from '../../../src/';
import { describe, expect, it } from '@jest/globals';

class ETHTest extends Token {
    readonly tokenAddress: Address = Address.of(
        '0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'
    );
    // 18 decimals
    readonly units: number = Units.ether;
    readonly name = 'EthTest';
}

class USDTest extends Token {
    readonly tokenAddress: Address = Address.of(
        '0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'
    );
    // 6 decimals
    readonly units: number = Units.mwei;
    readonly name = 'USDTest';
}

/**
 * Test Token class.
 * @group unit/vcdm
 */
describe('Token conversions', () => {
    describe('ETHTest', () => {
        it("should convert 1e18 base units to a human-readable value of '1.000000000000000000'", () => {
            // 1 ETH in base units is 1e18
            const ethToken = new ETHTest(1000000000000000000n);
            expect(ethToken.convertToHumanReadable()).toBe(
                '1.000000000000000000'
            );
        });

        it("should convert 1.5e18 base units to a human-readable value of '1.500000000000000000'", () => {
            // 1.5 ETH = 1500000000000000000 wei
            const ethToken = new ETHTest(1500000000000000000n);
            expect(ethToken.convertToHumanReadable()).toBe(
                '1.500000000000000000'
            );
        });
    });

    describe('USDTest', () => {
        it("should convert 1e6 base units to a human-readable value of '1.000000'", () => {
            const usdToken = new USDTest(1000000n);
            expect(usdToken.convertToHumanReadable()).toBe('1.000000');
        });

        it("should convert 123456 base units to a human-readable value of '1.23456'", () => {
            const usdToken = new USDTest(123456n);
            expect(usdToken.convertToHumanReadable()).toBe('0.123456');
        });

        it('should allow specifying a custom number of display decimals', () => {
            // Using displayDecimals of 4 should give us a 4-digit decimal.
            const usdToken = new USDTest(123456n);
            expect(usdToken.convertToHumanReadable(4)).toBe('1.23456');
        });
    });
});
