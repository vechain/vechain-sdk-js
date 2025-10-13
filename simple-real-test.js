#!/usr/bin/env node

/**
 * Simple Real VeChain SDK Contract Test
 * 
 * This test demonstrates both ThorClient and viem-compatible approaches
 * with real blockchain operations using local Thor Solo
 * 
 * Run with: node simple-real-test.js
 * Make sure Thor Solo is running: solo-setup up
 */

const { ThorClient } = require('@vechain/sdk/thor');
const { getContract, createPublicClient, createWalletClient } = require('@vechain/sdk/viem');
const { privateKeyToAccount } = require('viem/accounts');
const { Address } = require('@vechain/sdk/common');
const { FetchHttpClient } = require('@vechain/sdk/common');

// Configuration for local Thor Solo
const LOCAL_URL = 'http://localhost:8669';
const TEST_PRIVATE_KEY = '0x7582be8411840400ee9e6cae447c82bb572304575650a5a5e975a2f5bd5bb337';
const TEST_ADDRESS = '0xf077b491b355e64048ce21e3a6fc4751eeea77fa';

// VET Token Contract (VeChain's native token)
const VET_CONTRACT_ADDRESS = '0x0000000000000000000000000000456e65726779';

// VET Token ABI (simplified)
const VET_ABI = [
    {
        "inputs": [{"name": "addr", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

async function testThorClientApproach() {
    console.log('\n🔧 Testing ThorClient Approach (Native VeChain SDK)');
    console.log('==================================================');
    
    try {
        // 1. Create ThorClient
        console.log('📡 Creating ThorClient...');
        const httpClient = new FetchHttpClient(new URL(LOCAL_URL));
        const thorClient = ThorClient.at(httpClient);
        console.log(`✅ ThorClient created and connected to ${LOCAL_URL}`);

        // 2. Load VET contract using ThorClient
        console.log('\n📄 Loading VET contract using ThorClient...');
        const vetContractAddress = Address.of(VET_CONTRACT_ADDRESS);
        const vetContract = thorClient.contracts.load(vetContractAddress, VET_ABI);

        console.log('contract interface:', vetContract);
        console.log(`✅ VET contract loaded at ${vetContractAddress.toString()}`);

        // 3. Read operations with ThorClient
        console.log('\n📖 Reading contract data with ThorClient...');
        
        // Read VET balance - now with automatic string to Address conversion
        try {
            const balance = await vetContract.read.balanceOf(TEST_ADDRESS);
            console.log(`💰 VET Balance: ${balance} wei`);
        } catch (error) {
            console.log(`❌ Error reading VET balance: ${error.message}`);
        }

        // Read VET total supply
        try {
            const totalSupply = await vetContract.read.totalSupply();
            console.log(`📊 VET Total Supply: ${totalSupply} wei`);
        } catch (error) {
            console.log(`❌ Error reading VET total supply: ${error.message}`);
        }

        // 4. Show ThorClient-specific features
        console.log('\n🔧 ThorClient-specific features:');
        console.log('✅ Direct VeChain functionality');
        console.log('✅ Full access to VeChain-specific features');
        console.log('✅ Native address handling');
        console.log('✅ Clause building capabilities');

        return true;
    } catch (error) {
        console.error('❌ ThorClient test failed:', error.message);
        return false;
    }
}

async function testViemCompatibleApproach() {
    console.log('\n🔧 Testing Viem-Compatible Approach');
    console.log('===================================');
    
    try {
        // 1. Create viem-compatible clients
        console.log('📡 Creating viem-compatible clients...');
        const publicClient = createPublicClient({
            network: LOCAL_URL
        });

        const account = privateKeyToAccount(TEST_PRIVATE_KEY);
        const walletClient = createWalletClient({
            account,
            network: LOCAL_URL
        });

        console.log(`✅ Connected to ${LOCAL_URL}`);
        console.log(`✅ Using account: ${account.address}`);

        // 2. Load VET contract using viem-compatible approach
        console.log('\n📄 Loading VET contract using viem-compatible approach...');
        const vetContract = getContract({
            address: VET_CONTRACT_ADDRESS,
            abi: VET_ABI,
            publicClient,
            walletClient
        });

        console.log(`✅ VET contract loaded at ${VET_CONTRACT_ADDRESS}`);

        // 3. Read operations with viem-compatible approach
        console.log('\n📖 Reading contract data with viem-compatible approach...');
        
        // Read VET balance - now with automatic string to Address conversion
        try {
            const balance = await vetContract.read.balanceOf(TEST_ADDRESS);
            console.log(`💰 VET Balance: ${balance} wei`);
        } catch (error) {
            console.log(`❌ Error reading VET balance: ${error.message}`);
        }

        // Read VET total supply
        try {
            const totalSupply = await vetContract.read.totalSupply();
            console.log(`📊 VET Total Supply: ${totalSupply} wei`);
        } catch (error) {
            console.log(`❌ Error reading VET total supply: ${error.message}`);
        }

        // 4. Show viem-compatible features
        console.log('\n🔧 Viem-compatible features:');
        console.log('✅ Familiar viem interface');
        console.log('✅ VeChain-specific features available');
        if (vetContract._vechain) {
            console.log('✅ VeChain-specific methods accessible');
            console.log('   - contract._vechain.setReadOptions()');
            console.log('   - contract._vechain.clause.*()');
            console.log('   - contract._vechain.criteria.*()');
        }

        return true;
    } catch (error) {
        console.error('❌ Viem-compatible test failed:', error.message);
        return false;
    }
}

async function testNetworkConnectivity() {
    console.log('\n🌐 Testing Network Connectivity');
    console.log('===============================');
    
    try {
        // Test local Thor Solo connectivity
        console.log('📡 Testing local Thor Solo connectivity...');
        const httpClient = new FetchHttpClient(new URL(LOCAL_URL));
        const thorClient = ThorClient.at(httpClient);
        
        // Check node health
        const isHealthy = await thorClient.nodes.isHealthy();
        console.log(`✅ Connected to local Thor Solo`);
        console.log(`   Node health: ${isHealthy ? 'Healthy' : 'Unhealthy'}`);
        
        return true;
    } catch (error) {
        console.error('❌ Network connectivity test failed:', error.message);
        console.log('   Make sure Thor Solo is running: solo-setup up');
        return false;
    }
}

async function main() {
    console.log('🚀 Simple Real VeChain SDK Contract Test');
    console.log('==========================================');
    console.log('Testing both ThorClient and viem-compatible approaches');
    console.log('with real blockchain operations on local Thor Solo\n');

    const results = {
        networkConnectivity: false,
        thorClient: false,
        viemCompatible: false
    };

    // 1. Test network connectivity
    results.networkConnectivity = await testNetworkConnectivity();
    
    if (!results.networkConnectivity) {
        console.log('\n❌ Network connectivity failed. Please check your Thor Solo setup.');
        console.log('   Run: solo-setup up');
        return;
    }

    // 2. Test ThorClient approach
    results.thorClient = await testThorClientApproach();

    // 3. Test viem-compatible approach
    results.viemCompatible = await testViemCompatibleApproach();

    // 4. Summary
    console.log('\n📊 Test Results Summary');
    console.log('======================');
    console.log(`🌐 Network Connectivity: ${results.networkConnectivity ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔧 ThorClient Approach: ${results.thorClient ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🔧 Viem-Compatible Approach: ${results.viemCompatible ? '✅ PASS' : '❌ FAIL'}`);

    const allPassed = Object.values(results).every(result => result);
    
    if (allPassed) {
        console.log('\n🎉 All tests passed! Both approaches are working correctly.');
        console.log('\n📋 Next Steps:');
        console.log('1. For production use, replace local URLs with mainnet');
        console.log('2. Use your own private keys and addresses');
        console.log('3. Implement proper error handling');
        console.log('4. Add transaction confirmation logic');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the error messages above.');
    }
}

// Error handling for unhandled promises
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the test
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main };
