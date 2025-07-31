/**
 * Example: Integrating Gas Padding with Contract Transactions
 * 
 * This example demonstrates how to use the gas padding utility with
 * contract transactions like distributeRewardWithProof.
 */

import { 
    applyStandardPadding, 
    applyGasPadding, 
    GasPaddingManager,
    GAS_PADDING_PRESETS 
} from '../src/utils/gas-padding';
import { Units, FixedPointNumber } from '@vechain/sdk-core';

// Mock types for demonstration (replace with your actual types)
interface Request {
    amount: string;
    receiver: string;
    imageUrl: string;
    points: number;
}

interface ContractInstance {
    estimateGas: {
        distributeRewardWithProof: (...args: any[]) => Promise<number>;
    };
    transact: {
        distributeRewardWithProof: (...args: any[]) => Promise<{ wait: () => Promise<any> }>;
    };
}

// Example 1: Direct gas padding application
export async function distributeRewardWithStandardPadding(
    X2EarnRewardsPoolContract: ContractInstance,
    request: Request,
    APP_ID: string
) {
    const amount = Units.parseEther(
        FixedPointNumber.of(request.amount).toString()
    );
    const receiver = request.receiver;
    const proofTypes = ['image'];
    const proofValues = [request.imageUrl];
    const impactCodes = ['carbon'];
    const impactValues = [220 * request.points];
    const description = 'The user made a purchase favoring sustainable choices';

    try {
        // Step 1: Estimate gas for the transaction
        const gasEstimate = await X2EarnRewardsPoolContract.estimateGas.distributeRewardWithProof(
            APP_ID,
            amount.bi,
            receiver,
            proofTypes,
            proofValues,
            impactCodes,
            impactValues,
            description
        );

        // Step 2: Apply standard 20% gas padding
        const paddedGas = applyStandardPadding(gasEstimate);

        console.log(`Original gas estimate: ${gasEstimate}`);
        console.log(`Padded gas (20%): ${paddedGas}`);

        // Step 3: Execute transaction with padded gas
        const receipt = await (
            await X2EarnRewardsPoolContract.transact.distributeRewardWithProof(
                APP_ID,
                amount.bi,
                receiver,
                proofTypes,
                proofValues,
                impactCodes,
                impactValues,
                description,
                { gas: paddedGas } // Use padded gas
            )
        ).wait();

        if (receipt === null || receipt.reverted) {
            throw new Error(
                `Failed to distribute rewards: transaction id: ${receipt?.meta?.txID}`
            );
        }

        return receipt;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}

// Example 2: Custom gas padding with specific requirements
export async function distributeRewardWithCustomPadding(
    X2EarnRewardsPoolContract: ContractInstance,
    request: Request,
    APP_ID: string
) {
    const amount = Units.parseEther(
        FixedPointNumber.of(request.amount).toString()
    );
    const receiver = request.receiver;
    const proofTypes = ['image'];
    const proofValues = [request.imageUrl];
    const impactCodes = ['carbon'];
    const impactValues = [220 * request.points];
    const description = 'The user made a purchase favoring sustainable choices';

    try {
        // Estimate gas
        const gasEstimate = await X2EarnRewardsPoolContract.estimateGas.distributeRewardWithProof(
            APP_ID,
            amount.bi,
            receiver,
            proofTypes,
            proofValues,
            impactCodes,
            impactValues,
            description
        );

        // Apply custom padding: 25% multiplier + 5000 fixed padding
        const paddedGas = applyGasPadding(gasEstimate, {
            multiplier: 1.25,     // 25% padding
            fixedPadding: 5000,   // Plus 5000 gas
            minGas: 50000,        // Minimum for complex contracts
            maxGas: 2000000       // Maximum safety limit
        });

        console.log(`Custom padded gas: ${paddedGas}`);

        // Execute with custom padded gas
        const receipt = await (
            await X2EarnRewardsPoolContract.transact.distributeRewardWithProof(
                APP_ID,
                amount.bi,
                receiver,
                proofTypes,
                proofValues,
                impactCodes,
                impactValues,
                description,
                { gas: paddedGas }
            )
        ).wait();

        if (receipt === null || receipt.reverted) {
            throw new Error(
                `Failed to distribute rewards: transaction id: ${receipt?.meta?.txID}`
            );
        }

        return receipt;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}

// Example 3: Using GasPaddingManager for consistent padding across your app
export class RewardDistributionService {
    private gasPaddingManager: GasPaddingManager;
    private contract: ContractInstance;
    private appId: string;

    constructor(
        contract: ContractInstance, 
        appId: string,
        gasPaddingOptions = GAS_PADDING_PRESETS.SAFE // 30% padding by default
    ) {
        this.contract = contract;
        this.appId = appId;
        this.gasPaddingManager = new GasPaddingManager(gasPaddingOptions);
    }

    async distributeReward(request: Request) {
        const amount = Units.parseEther(
            FixedPointNumber.of(request.amount).toString()
        );
        const receiver = request.receiver;
        const proofTypes = ['image'];
        const proofValues = [request.imageUrl];
        const impactCodes = ['carbon'];
        const impactValues = [220 * request.points];
        const description = 'The user made a purchase favoring sustainable choices';

        try {
            // Estimate gas
            const gasEstimate = await this.contract.estimateGas.distributeRewardWithProof(
                this.appId,
                amount.bi,
                receiver,
                proofTypes,
                proofValues,
                impactCodes,
                impactValues,
                description
            );

            // Apply consistent padding using manager
            const paddedGas = this.gasPaddingManager.applyPadding(gasEstimate);

            console.log(`Service padded gas: ${paddedGas}`);

            // Execute transaction
            const receipt = await (
                await this.contract.transact.distributeRewardWithProof(
                    this.appId,
                    amount.bi,
                    receiver,
                    proofTypes,
                    proofValues,
                    impactCodes,
                    impactValues,
                    description,
                    { gas: paddedGas }
                )
            ).wait();

            if (receipt === null || receipt.reverted) {
                throw new Error(
                    `Failed to distribute rewards: transaction id: ${receipt?.meta?.txID}`
                );
            }

            return receipt;
        } catch (error) {
            console.error('Reward distribution failed:', error);
            throw error;
        }
    }

    // Update gas padding strategy
    updateGasPaddingStrategy(newOptions: Parameters<GasPaddingManager['updateOptions']>[0]) {
        this.gasPaddingManager.updateOptions(newOptions);
    }

    // Get current gas padding configuration
    getGasPaddingConfig() {
        return this.gasPaddingManager.getOptions();
    }
}

// Example 4: Adaptive gas padding based on network conditions
export async function distributeRewardWithAdaptivePadding(
    X2EarnRewardsPoolContract: ContractInstance,
    request: Request,
    APP_ID: string,
    networkCongestion: 'low' | 'medium' | 'high' = 'medium'
) {
    // Choose padding strategy based on network conditions
    let paddingPreset;
    switch (networkCongestion) {
        case 'low':
            paddingPreset = GAS_PADDING_PRESETS.CONSERVATIVE; // 10%
            break;
        case 'medium':
            paddingPreset = GAS_PADDING_PRESETS.STANDARD; // 20%
            break;
        case 'high':
            paddingPreset = GAS_PADDING_PRESETS.AGGRESSIVE; // 50%
            break;
    }

    const amount = Units.parseEther(
        FixedPointNumber.of(request.amount).toString()
    );
    const receiver = request.receiver;
    const proofTypes = ['image'];
    const proofValues = [request.imageUrl];
    const impactCodes = ['carbon'];
    const impactValues = [220 * request.points];
    const description = 'The user made a purchase favoring sustainable choices';

    try {
        // Estimate gas
        const gasEstimate = await X2EarnRewardsPoolContract.estimateGas.distributeRewardWithProof(
            APP_ID,
            amount.bi,
            receiver,
            proofTypes,
            proofValues,
            impactCodes,
            impactValues,
            description
        );

        // Apply adaptive padding
        const paddedGas = applyGasPadding(gasEstimate, paddingPreset);

        console.log(`Adaptive padding (${networkCongestion}): ${paddedGas}`);

        // Execute transaction
        const receipt = await (
            await X2EarnRewardsPoolContract.transact.distributeRewardWithProof(
                APP_ID,
                amount.bi,
                receiver,
                proofTypes,
                proofValues,
                impactCodes,
                impactValues,
                description,
                { gas: paddedGas }
            )
        ).wait();

        if (receipt === null || receipt.reverted) {
            throw new Error(
                `Failed to distribute rewards: transaction id: ${receipt?.meta?.txID}`
            );
        }

        return receipt;
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}

// Usage examples:
/*
// Basic usage with standard padding
await distributeRewardWithStandardPadding(contract, request, APP_ID);

// Custom padding for specific requirements
await distributeRewardWithCustomPadding(contract, request, APP_ID);

// Service-based approach for consistent padding
const rewardService = new RewardDistributionService(contract, APP_ID);
await rewardService.distributeReward(request);

// Adaptive padding based on network conditions
await distributeRewardWithAdaptivePadding(contract, request, APP_ID, 'high');
*/
