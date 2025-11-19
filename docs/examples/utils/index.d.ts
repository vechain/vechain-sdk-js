import { Address, Token, Units } from '@vechain/sdk-core';
declare class ETHTest extends Token {
    readonly tokenAddress: Address;
    readonly units: number;
    readonly name = "EthTest";
    constructor(value: bigint, valueUnits?: Units);
}
export { ETHTest };
//# sourceMappingURL=index.d.ts.map