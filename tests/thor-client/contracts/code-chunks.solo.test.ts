import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';

// Mock ABI for hasVoted function that returns boolean
const hasVotedAbi = [
    {
        inputs: [
            { internalType: 'uint256', name: 'roundId', type: 'uint256' },
            { internalType: 'address', name: 'user', type: 'address' }
        ],
        name: 'hasVoted',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// Mock ABI for balanceOf function that returns uint256
const balanceOfAbi = [
    {
        inputs: [
            { internalType: 'address', name: 'account', type: 'address' }
        ],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

/**
 * Test two different chunks of code to compare their behavior.
 *
 * @group unit/thor-client/contracts/code-chunks
 */
describe('Code Chunks Comparison', () => {
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = ThorClient.at(THOR_SOLO_URL);
    });

    test('Code Chunk 1: hasVoted function with boolean return', async () => {
        console.log('=== Testing Code Chunk 1 ===');
        
        // Mock the executeCall method for boolean return
        jest.spyOn(thorClient.contracts, 'executeCall').mockImplementation(async () => ({
            success: true,
            result: {
                plain: true,
                array: [true]
            }
        }));
        
        const contract = thorClient.contracts.load('0x1234567890123456789012345678901234567890', hasVotedAbi);
        const res = await contract.read.hasVoted(BigInt(1), '0x1234567890123456789012345678901234567890');
        
        console.log('Result type:', typeof res);
        console.log('Result:', res);
        console.log('res[0] type:', typeof res[0]);
        console.log('res[0] value:', res[0]);
        
        // Test type inference
        const hasVoted: boolean = res[0];
        console.log('hasVoted:', hasVoted);
        
        expect(typeof res[0]).toBe('boolean');
        expect(res[0]).toBe(true);
        expect(hasVoted).toBe(true);
    });

    test('Code Chunk 2: balanceOf function with bigint return', async () => {
        console.log('=== Testing Code Chunk 2 ===');
        
        // Mock the executeCall method for bigint return
        jest.spyOn(thorClient.contracts, 'executeCall').mockImplementation(async () => ({
            success: true,
            result: {
                plain: 1000n,
                array: [1000n]
            }
        }));
        
        const contract = thorClient.contracts.load('0x1234567890123456789012345678901234567890', balanceOfAbi);
        const res = await contract.read.balanceOf('0x1234567890123456789012345678901234567890');
        
        console.log('Result type:', typeof res);
        console.log('Result:', res);
        console.log('res[0] type:', typeof res[0]);
        console.log('res[0] value:', res[0]);
        
        // Test type inference
        const balance: bigint = res[0];
        console.log('balance:', balance);
        
        expect(typeof res[0]).toBe('bigint');
        expect(res[0]).toBe(1000n);
        expect(balance).toBe(1000n);
    });

    test('Compare both chunks side by side', async () => {
        console.log('=== Comparing Both Chunks ===');
        
        // Test Chunk 1
        jest.spyOn(thorClient.contracts, 'executeCall').mockImplementation(async () => ({
            success: true,
            result: {
                plain: true,
                array: [true]
            }
        }));
        
        const contract1 = thorClient.contracts.load('0x1234567890123456789012345678901234567890', hasVotedAbi);
        const res1 = await contract1.read.hasVoted(BigInt(1), '0x1234567890123456789012345678901234567890');
        
        console.log('Chunk 1 - res[0] type:', typeof res1[0]);
        console.log('Chunk 1 - res[0] value:', res1[0]);
        
        // Test Chunk 2
        jest.spyOn(thorClient.contracts, 'executeCall').mockImplementation(async () => ({
            success: true,
            result: {
                plain: 1000n,
                array: [1000n]
            }
        }));
        
        const contract2 = thorClient.contracts.load('0x1234567890123456789012345678901234567890', balanceOfAbi);
        const res2 = await contract2.read.balanceOf('0x1234567890123456789012345678901234567890');
        
        console.log('Chunk 2 - res[0] type:', typeof res2[0]);
        console.log('Chunk 2 - res[0] value:', res2[0]);
        
        // Summary
        console.log('\n=== Summary ===');
        console.log('Chunk 1 - res[0] type:', typeof res1[0]);
        console.log('Chunk 2 - res[0] type:', typeof res2[0]);
        
        expect(typeof res1[0]).toBe('boolean');
        expect(typeof res2[0]).toBe('bigint');
        expect(res1[0]).toBe(true);
        expect(res2[0]).toBe(1000n);
    });
}); 