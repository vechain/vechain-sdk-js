/**
 * RPC Method eth_gasPrice implementation
 *
 * @link [ethGasPrice](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_gasprice)
 */
const ethGasPrice = async (): Promise<string> => {
    // Dummy implementation
    return await Promise.resolve('0x0');
};

export { ethGasPrice };
