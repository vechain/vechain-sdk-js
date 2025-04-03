import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import { JSONRPCInternalError, stringifyData } from '@vechain/sdk-errors';

/**
 * RPC Method eth_maxPriorityFeePerGas implementation for Galactica hardfork
 * Returns a suggested priority fee per gas in wei.
 *
 * Priority fee multipliers based on network congestion:
 * - Low usage (0-70%): 1.1x base fee
 * - Moderate usage (70-90%): 1.2x base fee
 * - High congestion (90-100%): 1.5x base fee
 *
 * @link [eth_maxPriorityFeePerGas](https://ethereum.github.io/execution-apis/api-documentation/)
 * @param thorClient - The thor client instance to use.
 * @param _params - The standard array of rpc call parameters.
 * @param _provider - The provider instance to use.
 * @returns Priority fee suggestion in wei (hex string)
 * @throws {JSONRPCInternalError}
 */
const ethMaxPriorityFeePerGas = async (
    thorClient: ThorClient,
    _params: unknown[],
    _provider?: VeChainProvider
): Promise<string> => {
    try {
        // Get base gas price (equivalent to VTHO price)
        const {
            result: { plain: baseGasPrice }
        } = await thorClient.contracts.getBaseGasPrice();

        // Get latest block to check network conditions
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();

        // Calculate gas usage ratio with null check
        const gasUsedRatio =
            latestBlock !== null
                ? Number(latestBlock.gasUsed) / Number(latestBlock.gasLimit)
                : 0;

        // Determine multiplier based on network congestion
        let multiplier;
        if (gasUsedRatio > 0.9) {
            multiplier = 1.5; // High congestion: 50% premium
        } else if (gasUsedRatio > 0.7) {
            multiplier = 1.2; // Moderate usage: 20% premium
        } else {
            multiplier = 1.1; // Low usage: 10% premium
        }

        // Calculate priority fee with multiplier
        const baseFee = BigInt(baseGasPrice as bigint);
        const multiplierBasisPoints = BigInt(Math.floor(multiplier * 100));
        const priorityFee = (baseFee * multiplierBasisPoints) / BigInt(100);

        // Ensure minimum 1 VTHO fee
        const minFee = BigInt(1000000000); // 1 VTHO in wei
        const finalFee = priorityFee > minFee ? priorityFee : minFee;

        return '0x' + finalFee.toString(16);
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_maxPriorityFeePerGas()',
            'Method "eth_maxPriorityFeePerGas" failed.',
            {
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethMaxPriorityFeePerGas };
