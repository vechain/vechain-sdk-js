"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethGasPrice = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://ethereum.github.io/execution-apis/api-documentation/)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
const ethGasPrice = async (thorClient) => {
    // Check if Galactica hardfork has happened
    const galacticaForked = await thorClient.forkDetector.detectGalactica();
    if (!galacticaForked) {
        const { result: { plain } } = await thorClient.contracts.getLegacyBaseGasPrice();
        return sdk_core_1.HexUInt.of(plain).toString(true);
    }
    const bestBlock = await thorClient.blocks.getBestBlockCompressed();
    const baseFeePerGas = bestBlock?.baseFeePerGas;
    if (baseFeePerGas === undefined) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_gasPrice', 'Last block should have baseFeePerGas defined.', { params: bestBlock, url: thorClient.httpClient.baseURL });
    }
    const maxPriorityFeePerGas = await thorClient.gas.getMaxPriorityFeePerGas();
    const baseFee = sdk_core_1.HexUInt.of(baseFeePerGas).bi;
    const priority = sdk_core_1.HexUInt.of(maxPriorityFeePerGas).bi;
    return sdk_core_1.HexUInt.of(baseFee + priority).toString(true);
};
exports.ethGasPrice = ethGasPrice;
