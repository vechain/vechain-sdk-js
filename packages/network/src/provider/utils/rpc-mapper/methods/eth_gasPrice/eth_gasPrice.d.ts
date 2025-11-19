import { type ThorClient } from '../../../../../thor-client';
/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://ethereum.github.io/execution-apis/api-documentation/)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
declare const ethGasPrice: (thorClient: ThorClient) => Promise<string>;
export { ethGasPrice };
//# sourceMappingURL=eth_gasPrice.d.ts.map