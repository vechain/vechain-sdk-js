"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractAdapter = void 0;
const helpers_1 = require("./helpers");
/**
 * Contract adapter for the VeChain hardhat plugin
 *
 * @param contract - The contract to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract
 */
const contractAdapter = (contract, hardhatVeChainProvider) => {
    contract.getAddress = async function getAddress() {
        return await helpers_1.helpers.getContractAddress(contract.deploymentTransaction()?.hash ?? '', hardhatVeChainProvider);
    };
    return contract;
};
exports.contractAdapter = contractAdapter;
