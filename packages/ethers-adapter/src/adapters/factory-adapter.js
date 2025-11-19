"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.factoryAdapter = factoryAdapter;
const sdk_errors_1 = require("@vechain/sdk-errors");
const ethers_1 = require("ethers");
/**
 * Factory adapter for the VeChain hardhat plugin
 *
 * @param contractFactory - The contract factory to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract factory
 * @throws {UnsupportedOperation}
 */
function factoryAdapter(contractFactory, hardhatVeChainProvider) {
    contractFactory.deploy = async function (...args) {
        const tx = await this.getDeployTransaction(...args);
        if (this.runner == null ||
            typeof this.runner.sendTransaction !== 'function') {
            throw new sdk_errors_1.UnsupportedOperation('factoryAdapter()', 'Runner does not support sending transactions', {
                operation: 'sendTransaction'
            });
        }
        const sentTx = await this.runner.sendTransaction(tx);
        const receipt = await hardhatVeChainProvider.thorClient.transactions.waitForTransaction(sentTx.hash);
        return new ethers_1.BaseContract(receipt?.outputs[0]?.contractAddress ??
            (() => {
                throw new Error('Contract deployment failed: no contract address returned from transaction receipt');
            })(), this.interface, this.runner, sentTx);
    };
    return contractFactory;
}
