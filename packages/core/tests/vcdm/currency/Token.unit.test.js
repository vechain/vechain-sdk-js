"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../../src/");
const globals_1 = require("@jest/globals");
class ETHTest extends src_1.Token {
    tokenAddress = src_1.Address.of('0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5');
    units = src_1.Units.wei; // the lowest unit of the token is wei
    name = 'EthTest';
    constructor(value, valueUnits) {
        super(); // Pass a default value
        this.initialize(value, valueUnits); // Call the initialization method
    }
}
class USDTest extends src_1.Token {
    tokenAddress = src_1.Address.of('0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5');
    units = src_1.Units.mwei; // the lowest unit of the token is mwei
    name = 'USDTest';
    constructor(value, valueUnits) {
        super(); // Pass a default value
        this.initialize(value, valueUnits); // Call the initialization method
    }
}
/**
 * Test Token class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('Token tests', () => {
    (0, globals_1.describe)('ETHTest', () => {
        (0, globals_1.it)('should have correct value, name and token address', () => {
            const ethToken = new ETHTest(1000000000000000000n);
            (0, globals_1.expect)(ethToken.value).toBe(1000000000000000000n);
            (0, globals_1.expect)(ethToken.name).toBe('EthTest');
            (0, globals_1.expect)(ethToken.tokenAddress.isEqual(src_1.Address.of('0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5'))).toBe(true);
        });
        (0, globals_1.it)('1 wei should have correct value', () => {
            const ethToken = new ETHTest(1n); // 1 wei
            (0, globals_1.expect)(ethToken.value).toBe(1n);
            (0, globals_1.expect)(ethToken.format()).toBe('1');
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether)).toBe('0.000000000000000001');
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether, 1)).toBe('0.0');
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether, 2)).toBe('0.00');
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether, 0)).toBe('0');
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether, 10)).toBe('0.0000000000');
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether, 10)).toBe('0.0000000000');
        });
        (0, globals_1.it)("should convert 1e18 base units to a human-readable value of '1.0'", () => {
            // token base units is wei, so 1 ETH = 1e18 wei
            const ethToken = new ETHTest(1000000000000000000n);
            (0, globals_1.expect)(ethToken.value).toBe(1000000000000000000n);
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether, 1)).toBe('1.0');
        });
        (0, globals_1.it)("should convert 1.5e18 base units to a human-readable value of '1.5'", () => {
            // token base units is wei, so 1.5 ETH = 1500000000000000000 wei
            const ethToken = new ETHTest(1500000000000000000n);
            (0, globals_1.expect)(ethToken.format(src_1.Units.ether)).toBe('1.5');
        });
        (0, globals_1.it)('can be constructed using whole eth values', () => {
            // token base units is wei, so 1 ETH = 1e18 wei
            const ethToken = new ETHTest(1n, src_1.Units.ether);
            (0, globals_1.expect)(ethToken.value).toBe(1000000000000000000n);
        });
    });
    (0, globals_1.describe)('USDTest', () => {
        (0, globals_1.it)("should convert 10^12 base units to a human-readable value of '1.000000'", () => {
            // token base units is mwei, so 1 USD = 10^6 mwei
            const usdToken = new USDTest(1000000000000n);
            (0, globals_1.expect)(usdToken.value).toBe(1000000000000n);
            (0, globals_1.expect)(src_1.Units.convertUnits(src_1.FixedPointNumber.of(usdToken.value), src_1.Units.mwei, src_1.Units.wei).bi).toBe(src_1.FixedPointNumber.of(1000000000000000000n).bi);
            (0, globals_1.expect)(src_1.Units.convertUnits(src_1.FixedPointNumber.of(usdToken.value), src_1.Units.mwei, src_1.Units.ether).bi).toBe(src_1.FixedPointNumber.of(1n).bi);
            (0, globals_1.expect)(usdToken.format(src_1.Units.ether)).toBe('1');
            (0, globals_1.expect)(usdToken.format(src_1.Units.ether, 2)).toBe('1.00');
            (0, globals_1.expect)(usdToken.format(src_1.Units.ether, 0)).toBe('1');
            (0, globals_1.expect)(usdToken.format()).toBe('1000000000000');
        });
        (0, globals_1.it)("should convert 123456 base units to a human-readable value of '123456'", () => {
            const usdToken = new USDTest(123456n);
            (0, globals_1.expect)(usdToken.format()).toBe('123456');
        });
    });
});
