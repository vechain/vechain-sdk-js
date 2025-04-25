import { HexUInt } from '@vechain/sdk-core';
import { type ThorClient } from '../../../../../thor-client';

/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://ethereum.github.io/execution-apis/api-documentation/)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
const ethGasPrice = async (thorClient: ThorClient): Promise<string> => {
    const bestBlock = await thorClient.blocks.getBestBlockCompressed();
    const baseFeePerGas = bestBlock?.baseFeePerGas;

    // Legacy transactions
    if (baseFeePerGas === undefined) {
        const {
            result: { plain }
        } = await thorClient.contracts.getBaseGasPrice();
        return HexUInt.of(plain as bigint).toString(true);
    }

    const maxPriorityFeePerGas = await thorClient.gas.getMaxPriorityFeePerGas();

    const baseFee = HexUInt.of(baseFeePerGas).bi;
    const priority = HexUInt.of(maxPriorityFeePerGas).bi;

    return HexUInt.of(baseFee + priority).toString(true);
};

export { ethGasPrice };
