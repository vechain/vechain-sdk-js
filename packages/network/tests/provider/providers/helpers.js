"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForMessage = waitForMessage;
exports.deployERC20Contract = deployERC20Contract;
exports.deployERC721Contract = deployERC721Contract;
const fixture_1 = require("./fixture");
const sdk_core_1 = require("@vechain/sdk-core");
async function waitForMessage(provider) {
    return await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            // Clean up event listener on timeout
            provider.removeAllListeners('message');
            provider.destroy();
            reject(new Error('Timeout waiting for subscription message'));
        }, 120000); // Longer timeout in CI
        const messageHandler = (message) => {
            clearTimeout(timeout);
            // Remove the specific event listener
            provider.off('message', messageHandler);
            resolve(message);
            provider.destroy();
        };
        provider.on('message', messageHandler);
    });
}
async function deployERC20Contract(thorClient, signer) {
    const factory = thorClient.contracts.createContractFactory(fixture_1.ERC20_ABI, fixture_1.ERC20_BYTECODE, signer);
    await factory.startDeployment();
    return await factory.waitForDeployment();
}
async function deployERC721Contract(thorClient, signer) {
    const factory = thorClient.contracts.createContractFactory(sdk_core_1.ERC721_ABI, fixture_1.ERC721_BYTECODE, signer);
    await factory.startDeployment();
    return await factory.waitForDeployment();
}
