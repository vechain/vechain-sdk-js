import { Address, Token, Units } from '@vechain/sdk-core';
class ETHTest extends Token {
    tokenAddress = Address.of('0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5');
    // 18 decimals
    units = Units.wei;
    name = 'EthTest';
    constructor(value, valueUnits) {
        super(); // Pass a default value
        this.initialize(value, valueUnits); // Call the initialization method
    }
}
export { ETHTest };
