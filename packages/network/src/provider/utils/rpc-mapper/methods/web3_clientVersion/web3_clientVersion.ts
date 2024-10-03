/**
 * RPC Method web3_clientVersion implementation
 *
 * @link [web3_clientVersion](https://docs.infura.io/networks/ethereum/json-rpc-methods/web3_clientversion)
 *
 * @returns A string representing the current client version.
 */
const web3ClientVersion = async (): Promise<string> => {
    return await Promise.resolve('thor');
};

export { web3ClientVersion };
