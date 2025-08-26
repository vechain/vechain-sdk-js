import { HexUInt } from '@vechain/sdk-core';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import { type ThorClient } from '../../../../../thor-client';

/**
 * RPC Method eth_gasPrice implementation
 * @link [ethGasPrice](https://ethereum.github.io/execution-apis/api-documentation/)
 * @returns The current gas price in Wei unit considering that 1 VTHO equals 1e18 Wei.
 */
const ethGasPrice = async (thorClient: ThorClient): Promise<string> => {
    // Check if Galactica hardfork has happened
    const galacticaForked = await thorClient.forkDetector.detectGalactica();
    if (!galacticaForked) {
        const {
            result: { plain }
        } = await thorClient.contracts.getLegacyBaseGasPrice();
        return HexUInt.of(plain as bigint).toString(true);
    }

    const bestBlock = await thorClient.blocks.getBestBlockCompressed();
    const baseFeePerGas = bestBlock?.baseFeePerGas;

    if (baseFeePerGas === undefined) {
        throw new JSONRPCInternalError(
            'eth_gasPrice',
            'Last block should have baseFeePerGas defined.',
            { params: bestBlock, url: thorClient.httpClient.baseURL }
        );
    }
    const maxPriorityFeePerGas = await thorClient.gas.getMaxPriorityFeePerGas();

    const baseFee = HexUInt.of(baseFeePerGas).bi;
    const priority = HexUInt.of(maxPriorityFeePerGas).bi;

    return HexUInt.of(baseFee + priority).toString(true);
};

export { ethGasPrice };
