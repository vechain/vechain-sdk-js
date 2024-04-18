import { type ThorClient } from '../../../../../../thor-client';

/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gasprice)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
const ethGasPrice = async (thorClient: ThorClient): Promise<string> => {
    const result = BigInt(
        (await Promise.resolve(
            thorClient.contracts.getBaseGasPrice()
        )) as string
    );

    return '0x' + result.toString(16);
};

export { ethGasPrice };
