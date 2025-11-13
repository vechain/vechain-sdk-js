/**
 * Simple Example: Quick Start with VeChain Viem Contracts
 *
 * This is a minimal example showing the most common use case.
 */

import { Address } from '@vechain/sdk-temp/common';
import { VTHO_ADDRESS } from '@vechain/sdk-temp/thor';
import { createPublicClient, getContract } from '@vechain/sdk-temp/viem';

// Simplified ERC20 ABI
const ERC20_ABI = [
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
    },
    {
        type: 'function',
        name: 'symbol',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }]
    },
    {
        type: 'function',
        name: 'decimals',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint8' }]
    }
] as const;

async function main(): Promise<void> {
    console.log('🚀 VeChain Viem Contracts - Quick Start\n');

    // 2. Create a public client (for read operations)
    const publicClient = createPublicClient({
        network: new URL('https://testnet.vechain.org')
    });

    // 3. Create contract instance
    const vthoContract = getContract({
        address: Address.of(VTHO_ADDRESS), // VTHO on testnet
        abi: ERC20_ABI,
        publicClient
    });

    console.log('📄 Contract loaded:', vthoContract.address.toString());

    // 4. Read from contract
    try {
        const userAddress = '0x5034aa590125b64023a0262112b98d72e3c8e40e';

        console.log('\n📖 Reading token information...');

        // Get balance
        const balance = await vthoContract.read.balanceOf([userAddress]);
        console.log('💰 Balance:', balance);

        // Get symbol
        const symbol = await vthoContract.read.symbol();
        console.log('🏷️  Symbol:', symbol);

        // Get decimals
        const decimals = await vthoContract.read.decimals();
        console.log('🔢 Decimals:', decimals);

        console.log('\n✅ Success!');
    } catch (error) {
        console.error(
            '\n❌ Error:',
            error instanceof Error ? error.message : error
        );
    }
}

// Run the example
main().catch(console.error);
