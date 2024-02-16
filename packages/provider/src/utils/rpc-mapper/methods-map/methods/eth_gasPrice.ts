/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gasprice)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
const ethGasPrice = async (): Promise<string> => {
    // Dummy implementation
    return await Promise.resolve('0x9184e72a000');
};

export { ethGasPrice };
