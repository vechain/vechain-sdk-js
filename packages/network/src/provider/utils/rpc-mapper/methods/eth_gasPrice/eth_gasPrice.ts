import { type ThorClient } from '../../../../../thor-client';

/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://ethereum.github.io/execution-apis/api-documentation/)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
const ethGasPrice = async (thorClient: ThorClient): Promise<string> => {
    const {
        result: { plain }
    } = await thorClient.contracts.getBaseGasPrice();

    return '0x' + BigInt(plain as bigint).toString(16);
};

export { ethGasPrice };
