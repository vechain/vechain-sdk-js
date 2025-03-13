import { Address, Token, Units } from '../../../src/';
import { describe, expect, it } from '@jest/globals';

class ETHTest extends Token {
    // Token address
    readonly tokenAddress: Address = Address.of(
        '0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'
    );
    // ETH uses 18 decimals
    readonly units: number = Units.ether;
    // Also provide a dummy token name.
    readonly name = 'EthTest';
}

class USDTest extends Token {
    // Token address
    readonly tokenAddress: Address = Address.of(
        '0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'
    );
    // BTC use 8 decimals.
    readonly units: number = Units.mwei;
    // Also provide a dummy token name.
    readonly name = 'USDTest';
}

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
        it("should convert 1e8 base units to a human-readable value of '1.00000000'", () => {
            // For a token with 8 decimals, 1 token is represented as 1e8.
            const usdToken = new USDTest(100000000n);
            expect(usdToken.convertToHumanReadable()).toBe('1.00000000');
        });

        it("should convert 123456789 base units to a human-readable value of '1.23456789'", () => {
            // For a token with 8 decimals, 123456789 represents 1.23456789.
            const usdToken = new USDTest(123456789n);
            expect(usdToken.convertToHumanReadable()).toBe('1.23456789');
        });

        it('should allow specifying a custom number of display decimals', () => {
            // Using displayDecimals of 4 should give us a 4-digit fraction.
            // For example, if the token's value is 123456789, with 8 decimals its "raw" representation is 1.23456789.
            // When displaying with 4 decimals, we compute divisor = 10^4 = 10000.
            // whole = 123456789 / 10000 = 12345, remainder = 6789 → "12345.6789"
            const usdToken = new USDTest(123456789n);
            expect(usdToken.convertToHumanReadable(4)).toBe('12345.6789');
        });
    });
});
