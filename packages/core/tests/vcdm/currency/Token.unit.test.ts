import { Address, FixedPointNumber, Token, Units } from '../../../src/';
import { describe, expect, it } from '@jest/globals';

class ETHTest extends Token {
    readonly tokenAddress: Address = Address.of(
        '0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'
    );
    readonly units: Units = Units.wei; // the lowest unit of the token is wei
    readonly name = 'EthTest';
    constructor(value: bigint, valueUnits?: Units) {
        super(); // Pass a default value
        this.initialize(value, valueUnits); // Call the initialization method
    }
}

class USDTest extends Token {
    readonly tokenAddress: Address = Address.of(
        '0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'
    );
    readonly units: Units = Units.mwei; // the lowest unit of the token is mwei
    readonly name = 'USDTest';
    constructor(value: bigint, valueUnits?: Units) {
        super(); // Pass a default value
        this.initialize(value, valueUnits); // Call the initialization method
    }
}

/**
 * Test Token class.
 * @group unit/vcdm
 */
describe('Token tests', () => {
    describe('ETHTest', () => {
        it('should have correct value, name and token address', () => {
            const ethToken = new ETHTest(1000000000000000000n);
            expect(ethToken.value).toBe(1000000000000000000n);
            expect(ethToken.name).toBe('EthTest');
            expect(
                ethToken.tokenAddress.isEqual(
                    Address.of('0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5')
                )
            ).toBe(true);
        });

        it('1 wei should have correct value', () => {
            const ethToken = new ETHTest(1n); // 1 wei
            expect(ethToken.value).toBe(1n);
            expect(ethToken.format()).toBe('1');
            expect(ethToken.format(Units.ether)).toBe('0.000000000000000001');
            expect(ethToken.format(Units.ether, 1)).toBe('0.0');
            expect(ethToken.format(Units.ether, 2)).toBe('0.00');
            expect(ethToken.format(Units.ether, 0)).toBe('0');
            expect(ethToken.format(Units.ether, 10)).toBe('0.0000000000');
            expect(ethToken.format(Units.ether, 10)).toBe('0.0000000000');
        });

        it("should convert 1e18 base units to a human-readable value of '1.0'", () => {
            // token base units is wei, so 1 ETH = 1e18 wei
            const ethToken = new ETHTest(1000000000000000000n);
            expect(ethToken.value).toBe(1000000000000000000n);
            expect(ethToken.format(Units.ether, 1)).toBe('1.0');
        });

        it("should convert 1.5e18 base units to a human-readable value of '1.5'", () => {
            // token base units is wei, so 1.5 ETH = 1500000000000000000 wei
            const ethToken = new ETHTest(1500000000000000000n);
            expect(ethToken.format(Units.ether)).toBe('1.5');
        });
        it('can be constructed using whole eth values', () => {
            // token base units is wei, so 1 ETH = 1e18 wei
            const ethToken = new ETHTest(1n, Units.ether);
            expect(ethToken.value).toBe(1000000000000000000n);
        });
    });

    describe('USDTest', () => {
        it("should convert 10^12 base units to a human-readable value of '1.000000'", () => {
            // token base units is mwei, so 1 USD = 10^6 mwei
            const usdToken = new USDTest(1000000000000n);
            expect(usdToken.value).toBe(1000000000000n);
            expect(
                Units.convertUnits(
                    FixedPointNumber.of(usdToken.value),
                    Units.mwei,
                    Units.wei
                ).bi
            ).toBe(FixedPointNumber.of(1000000000000000000n).bi);
            expect(
                Units.convertUnits(
                    FixedPointNumber.of(usdToken.value),
                    Units.mwei,
                    Units.ether
                ).bi
            ).toBe(FixedPointNumber.of(1n).bi);
            expect(usdToken.format(Units.ether)).toBe('1');
            expect(usdToken.format(Units.ether, 2)).toBe('1.00');
            expect(usdToken.format(Units.ether, 0)).toBe('1');
            expect(usdToken.format()).toBe('1000000000000');
        });

        it("should convert 123456 base units to a human-readable value of '123456'", () => {
            const usdToken = new USDTest(123456n);
            expect(usdToken.format()).toBe('123456');
        });
    });
});
