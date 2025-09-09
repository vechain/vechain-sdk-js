import { 
    PrivateKeySigner, 
    TransactionRequest, 
    DynamicFeeCalculator,
    type Block 
} from '@vechain/sdk-network';
import { Address, Hex, HexUInt } from '@vechain/sdk-core';

/**
 * Example demonstrating dynamic fee (EIP-1559) transaction signing with VeChain SDK
 */
async function dynamicFeeSigningExample() {
    // Example private key (DO NOT use in production)
    const privateKey = new Uint8Array(32).fill(1);
    const signer = new PrivateKeySigner(privateKey);

    // Mock block with baseFeePerGas (in real usage, get from PublicClient.getBlock())
    const mockBlock: Block = {
        number: 12345,
        baseFeePerGas: 1000000000n, // 1 Gwei base fee
        gasLimit: 10000000n,
        gasUsed: 5000000n,
        timestamp: Date.now(),
    } as Block;

    console.log('=== Dynamic Fee Transaction Example ===');
    console.log(`Block base fee: ${mockBlock.baseFeePerGas} wei`);

    // 1. Calculate suggested dynamic fees
    const { maxFeePerGas, maxPriorityFeePerGas } = DynamicFeeCalculator.suggestDynamicFees(
        mockBlock,
        'standard' // or 'slow', 'fast'
    );

    console.log(`Suggested maxFeePerGas: ${maxFeePerGas} wei`);
    console.log(`Suggested maxPriorityFeePerGas: ${maxPriorityFeePerGas} wei`);

    // 2. Create a dynamic fee transaction (type 2)
    const dynamicFeeTransaction = new TransactionRequest({
        blockRef: HexUInt.of('0x00000000aabbccdd'),
        chainTag: 0x27, // Testnet chain tag
        clauses: [{
            to: Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            value: 1000000000000000000n, // 1 VET
            data: Hex.of('0x')
        }],
        dependsOn: null,
        expiration: 32,
        gas: 21000n,
        gasPriceCoef: 0n, // Not used for dynamic fee transactions
        nonce: 12345678,
        isSponsored: false,
        // Dynamic fee fields (automatically detected as EIP-1559)
        maxFeePerGas,
        maxPriorityFeePerGas
    });

    // 3. Sign the dynamic fee transaction
    const signedDynamicTx = signer.sign(dynamicFeeTransaction);
    console.log(`\nSigned dynamic fee transaction (auto-detected): ${signedDynamicTx.isDynamicFee() ? 'EIP-1559' : 'Legacy'}`);
    console.log(`Transaction maxFeePerGas: ${signedDynamicTx.maxFeePerGas}`);
    console.log(`Transaction maxPriorityFeePerGas: ${signedDynamicTx.maxPriorityFeePerGas}`);

    // 4. Calculate effective gas price that will be used
    const effectiveGasPrice = DynamicFeeCalculator.calculateEffectiveGasPrice(
        mockBlock.baseFeePerGas!,
        maxFeePerGas,
        maxPriorityFeePerGas
    );
    console.log(`Effective gas price: ${effectiveGasPrice} wei`);

    // 5. Compare with legacy transaction
    console.log('\n=== Legacy Transaction Comparison ===');
    
    // Convert dynamic fees back to legacy gasPriceCoef for comparison
    const legacyEquivalent = DynamicFeeCalculator.convertLegacyToEIP1559(
        128n, // Example gasPriceCoef
        mockBlock.baseFeePerGas!
    );
    
    const legacyTransaction = new TransactionRequest({
        blockRef: HexUInt.of('0x00000000aabbccdd'),
        chainTag: 0x27,
        clauses: [{
            to: Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            value: 1000000000000000000n,
            data: Hex.of('0x')
        }],
        dependsOn: null,
        expiration: 32,
        gas: 21000n,
        gasPriceCoef: 128n, // Legacy gas price coefficient
        nonce: 12345678,
        isSponsored: false
        // No maxFeePerGas/maxPriorityFeePerGas = automatically legacy
    });

    const signedLegacyTx = signer.sign(legacyTransaction);
    console.log(`Legacy transaction (auto-detected): ${signedLegacyTx.isDynamicFee() ? 'EIP-1559' : 'Legacy'}`);
    console.log(`Legacy gasPriceCoef: ${signedLegacyTx.gasPriceCoef}`);
    console.log(`Legacy equivalent maxFeePerGas: ${legacyEquivalent.maxFeePerGas}`);
    console.log(`Legacy equivalent maxPriorityFeePerGas: ${legacyEquivalent.maxPriorityFeePerGas}`);

    // 6. Demonstrate fee validation
    console.log('\n=== Fee Validation ===');
    try {
        DynamicFeeCalculator.validateDynamicFees(
            maxFeePerGas,
            maxPriorityFeePerGas,
            mockBlock.baseFeePerGas!
        );
        console.log('✅ Dynamic fees are valid');
    } catch (error) {
        console.log('❌ Dynamic fees are invalid:', error.message);
    }

    // 7. Test invalid fees
    try {
        DynamicFeeCalculator.validateDynamicFees(
            500000000n, // maxFeePerGas too low
            maxPriorityFeePerGas,
            mockBlock.baseFeePerGas!
        );
    } catch (error) {
        console.log('✅ Correctly caught invalid fee:', error.message);
    }

    return {
        dynamicFeeTransaction: signedDynamicTx,
        legacyTransaction: signedLegacyTx,
        effectiveGasPrice,
        suggestedFees: { maxFeePerGas, maxPriorityFeePerGas }
    };
}

// Run the example
if (require.main === module) {
    dynamicFeeSigningExample()
        .then((result) => {
            console.log('\n=== Example completed successfully ===');
            console.log('Dynamic fee transaction ready for broadcast');
        })
        .catch((error) => {
            console.error('Example failed:', error);
        });
}

export { dynamicFeeSigningExample };
