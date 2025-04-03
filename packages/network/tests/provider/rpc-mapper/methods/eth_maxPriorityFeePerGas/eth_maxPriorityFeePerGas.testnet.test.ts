import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    TESTNET_URL,
    ThorClient,
    VeChainProvider,
    type ContractCallResult,
    type CompressedBlockDetail
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'eth_maxPriorityFeePerGas' method
 *
 * @group integration/rpc-mapper/methods/eth_maxPriorityFeePerGas
 */
describe('RPC Mapper - eth_maxPriorityFeePerGas method tests', () => {
    /**
     * Thor client instance and provider
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;
    const mockBaseGasPrice = BigInt(1000000000); // 1 GWEI
    const mockGasLimit = BigInt(1000000);

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
        provider = new VeChainProvider(thorClient);

        // Mock the getBaseGasPrice method with proper type
        const mockGasPrice: ContractCallResult = {
            result: { plain: mockBaseGasPrice }
        };
        jest.spyOn(thorClient.contracts, 'getBaseGasPrice').mockResolvedValue(
            mockGasPrice
        );
    });

    const testCases = [
        {
            name: 'should return 1.1x base fee at low usage (below 70%)',
            gasUsed: (mockGasLimit * BigInt(50)) / BigInt(100), // 50% usage
            expectedMultiplier: 1.1
        },
        {
            name: 'should return 1.2x base fee at moderate usage (70-90%)',
            gasUsed: (mockGasLimit * BigInt(80)) / BigInt(100), // 80% usage
            expectedMultiplier: 1.2
        },
        {
            name: 'should return 1.5x base fee at high usage (above 90%)',
            gasUsed: (mockGasLimit * BigInt(95)) / BigInt(100), // 95% usage
            expectedMultiplier: 1.5
        }
    ];

    testCases.forEach(({ name, gasUsed, expectedMultiplier }) => {
        test(name, async () => {
            // Mock the getBestBlockCompressed method with proper type
            const mockBlock: CompressedBlockDetail = {
                number: 0,
                id: '0x0',
                size: 0,
                parentID: '0x0',
                timestamp: 0,
                gasLimit: Number(mockGasLimit),
                beneficiary: '0x0',
                gasUsed: Number(gasUsed),
                totalScore: 0,
                txsRoot: '0x0',
                txsFeatures: 0,
                stateRoot: '0x0',
                receiptsRoot: '0x0',
                com: false,
                signer: '0x0',
                isTrunk: true,
                isFinalized: false,
                transactions: []
            };
            jest.spyOn(
                thorClient.blocks,
                'getBestBlockCompressed'
            ).mockResolvedValue(mockBlock);

            const result = await provider.request({
                method: RPC_METHODS.eth_maxPriorityFeePerGas,
                params: []
            });

            const expectedFee =
                (mockBaseGasPrice *
                    BigInt(Math.floor(expectedMultiplier * 100))) /
                BigInt(100);
            expect(BigInt(result as string)).toBe(expectedFee);
        });
    });

    test('should return minimum 1 VTHO when calculation results in lower value', async () => {
        // Mock with very low base gas price
        const mockLowGasPrice: ContractCallResult = {
            result: { plain: BigInt(100) }
        };
        jest.spyOn(thorClient.contracts, 'getBaseGasPrice').mockResolvedValue(
            mockLowGasPrice
        );

        const mockLowBlock: CompressedBlockDetail = {
            number: 0,
            id: '0x0',
            size: 0,
            parentID: '0x0',
            timestamp: 0,
            gasLimit: Number(mockGasLimit),
            beneficiary: '0x0',
            gasUsed: 0,
            totalScore: 0,
            txsRoot: '0x0',
            txsFeatures: 0,
            stateRoot: '0x0',
            receiptsRoot: '0x0',
            com: false,
            signer: '0x0',
            isTrunk: true,
            isFinalized: false,
            transactions: []
        };
        jest.spyOn(
            thorClient.blocks,
            'getBestBlockCompressed'
        ).mockResolvedValue(mockLowBlock);

        const result = await provider.request({
            method: RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });

        expect(BigInt(result as string)).toBeGreaterThanOrEqual(
            BigInt(1000000000)
        ); // Min 1 VTHO
    });

    test('should handle missing block data gracefully', async () => {
        jest.spyOn(
            thorClient.blocks,
            'getBestBlockCompressed'
        ).mockResolvedValue(null);

        const result = await provider.request({
            method: RPC_METHODS.eth_maxPriorityFeePerGas,
            params: []
        });

        // Should use low usage multiplier (1.1x) when block data is unavailable
        const expectedFee = (mockBaseGasPrice * BigInt(110)) / BigInt(100);
        expect(BigInt(result as string)).toBe(expectedFee);
    });
});
