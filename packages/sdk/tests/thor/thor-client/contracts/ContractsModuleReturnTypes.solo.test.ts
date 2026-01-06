import { Address, Hex } from '@common/vcdm';
import { describe, expect, test, beforeAll } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';
import { getConfigData, type ConfigData } from '@vechain/sdk-solo-setup';
import type { Abi, AbiFunction } from 'viem';

/**
 * Integration tests for contract return type decoding.
 * Tests that all Solidity return types are correctly decoded by the contracts module.
 *
 * @group solo
 */
describe('ContractsModule Return Types Solo Tests', () => {
    let thorClient: ThorClient;
    let testingContractAddress: Address;
    let testingContractAbi: Abi;
    let soloConfig: ConfigData;

    // Test addresses
    const testAddress = '0x1234567890123456789012345678901234567890';

    beforeAll(() => {
        thorClient = ThorClient.at(ThorNetworks.SOLONET);
        soloConfig = getConfigData();
        testingContractAddress = Address.of(
            soloConfig.TESTING_CONTRACT_ADDRESS
        );
        testingContractAbi = soloConfig.TESTING_CONTRACT_ABI as Abi;
    });

    /**
     * Helper to get function ABI by name
     */
    const getFunctionAbi = (name: string): AbiFunction => {
        const fn = testingContractAbi.find(
            (item) => item.type === 'function' && item.name === name
        );
        if (!fn || fn.type !== 'function') {
            throw new Error(`Function ${name} not found in ABI`);
        }
        return fn as AbiFunction;
    };

    // ==================== Scalar Types ====================

    describe('Scalar Types', () => {
        test('Should decode bool return type', async () => {
            const functionAbi = getFunctionAbi('boolData');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [true]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(true);
            expect(result.result.array).toEqual([true]);
        });

        test('Should decode bool false return type', async () => {
            const functionAbi = getFunctionAbi('boolData');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [false]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(false);
            expect(result.result.array).toEqual([false]);
        });

        test('Should decode int256 return type (positive)', async () => {
            const functionAbi = getFunctionAbi('intData');
            const testValue = 12345n;
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
            expect(result.result.array).toEqual([testValue]);
        });

        test('Should decode int256 return type (negative)', async () => {
            const functionAbi = getFunctionAbi('intData');
            const testValue = -12345n;
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
            expect(result.result.array).toEqual([testValue]);
        });

        test('Should decode uint256 return type', async () => {
            const functionAbi = getFunctionAbi('uintData');
            const testValue = 99999999999999999999n;
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
            expect(result.result.array).toEqual([testValue]);
        });

        test('Should decode address return type', async () => {
            const functionAbi = getFunctionAbi('addressData');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testAddress]
            );

            expect(result.success).toBe(true);
            // Address should be checksummed
            expect((result.result.plain as string).toLowerCase()).toBe(
                testAddress.toLowerCase()
            );
        });

        test('Should decode bytes32 return type', async () => {
            const functionAbi = getFunctionAbi('bytes32Data');
            const testValue =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
            expect(result.result.array).toEqual([testValue]);
        });

        test('Should decode string return type', async () => {
            const functionAbi = getFunctionAbi('stringData');
            const testValue = 'Hello, VeChain SDK!';
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
            expect(result.result.array).toEqual([testValue]);
        });

        test('Should decode string with special characters', async () => {
            const functionAbi = getFunctionAbi('stringData');
            const testValue = 'Hello! @#$%^&*() 你好 🚀';
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
        });

        test('Should decode empty string return type', async () => {
            const functionAbi = getFunctionAbi('stringData');
            const testValue = '';
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(testValue);
        });
    });

    // ==================== Array Types ====================

    describe('Array Types', () => {
        test('Should decode fixed-size array (uint256[3]) return type', async () => {
            const functionAbi = getFunctionAbi('fixedArrayData');
            const testValue = [1n, 2n, 3n] as const;
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            // Fixed arrays are returned as arrays
            expect(result.result.plain).toEqual([1n, 2n, 3n]);
        });

        test('Should decode fixed-size array with large values', async () => {
            const functionAbi = getFunctionAbi('fixedArrayData');
            const testValue = [
                999999999999999999999999n,
                888888888888888888888888n,
                777777777777777777777777n
            ] as const;
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toEqual(testValue);
        });

        test('Should decode dynamic array (uint256[]) return type', async () => {
            const functionAbi = getFunctionAbi('dynamicArrayData');
            const testValue = [10n, 20n, 30n, 40n, 50n];
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toEqual(testValue);
        });

        test('Should decode empty dynamic array', async () => {
            const functionAbi = getFunctionAbi('dynamicArrayData');
            const testValue: bigint[] = [];
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toEqual([]);
        });

        test('Should decode large dynamic array', async () => {
            const functionAbi = getFunctionAbi('dynamicArrayData');
            const testValue = Array.from({ length: 100 }, (_, i) => BigInt(i));
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testValue]
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toEqual(testValue);
        });
    });

    // ==================== Struct Type ====================

    describe('Struct Type', () => {
        test('Should decode struct return type', async () => {
            const functionAbi = getFunctionAbi('structData');
            const testStruct = {
                id: 42n,
                name: 'Test Struct'
            };
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testStruct]
            );

            expect(result.success).toBe(true);
            // Struct should be returned as object
            const decoded = result.result.plain as unknown as {
                id: bigint;
                name: string;
            };
            expect(decoded.id).toBe(42n);
            expect(decoded.name).toBe('Test Struct');
        });

        test('Should decode struct with empty string', async () => {
            const functionAbi = getFunctionAbi('structData');
            const testStruct = {
                id: 0n,
                name: ''
            };
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testStruct]
            );

            expect(result.success).toBe(true);
            const decoded = result.result.plain as unknown as {
                id: bigint;
                name: string;
            };
            expect(decoded.id).toBe(0n);
            expect(decoded.name).toBe('');
        });

        test('Should decode struct with large id', async () => {
            const functionAbi = getFunctionAbi('structData');
            const testStruct = {
                id: 123456789012345678901234567890n,
                name: 'Big ID Struct'
            };
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testStruct]
            );

            expect(result.success).toBe(true);
            const decoded = result.result.plain as unknown as {
                id: bigint;
                name: string;
            };
            expect(decoded.id).toBe(testStruct.id);
            expect(decoded.name).toBe(testStruct.name);
        });
    });

    // ==================== Enum Type ====================

    describe('Enum Type', () => {
        test('Should decode enum return type - SMALL (0)', async () => {
            const functionAbi = getFunctionAbi('enumData');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [0] // SMALL
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(0);
        });

        test('Should decode enum return type - MEDIUM (1)', async () => {
            const functionAbi = getFunctionAbi('enumData');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [1] // MEDIUM
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(1);
        });

        test('Should decode enum return type - LARGE (2)', async () => {
            const functionAbi = getFunctionAbi('enumData');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [2] // LARGE
            );

            expect(result.success).toBe(true);
            expect(result.result.plain).toBe(2);
        });
    });

    // ==================== Tuple / Multiple Return Values ====================

    describe('Tuple / Multiple Return Values', () => {
        test('Should decode multiple int return values (tuple)', async () => {
            const functionAbi = getFunctionAbi('multipleIntData');
            const inputs = [
                255, // uint8
                65535, // uint16
                4294967295, // uint32
                18446744073709551615n, // uint64
                1461501637330902918203684832716283019655932542975n, // uint160
                115792089237316195423570985008687907853269984665640564039457584007913129639935n // uint256 (max)
            ];

            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                inputs
            );

            expect(result.success).toBe(true);
            // Multiple return values should be returned as array
            const decoded = result.result.array;
            expect(decoded).toBeDefined();
            expect(decoded?.length).toBe(6);
            expect(decoded?.[0]).toBe(255);
            expect(decoded?.[1]).toBe(65535);
            expect(decoded?.[2]).toBe(4294967295);
            expect(decoded?.[3]).toBe(18446744073709551615n);
            // Note: large numbers may be returned as bigint
        });

        test('Should decode complex multiple return values (multipleData)', async () => {
            const functionAbi = getFunctionAbi('multipleData');
            const testBytes32 =
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

            const inputs = [
                12345n, // uint
                testAddress, // address
                testBytes32, // bytes32
                'Hello VeChain', // string
                [100n, 200n, 300n] as const, // uint[3] fixed array
                [1n, 2n, 3n, 4n, 5n], // uint[] dynamic array
                { id: 99n, name: 'Nested Struct' }, // struct
                1 // enum (MEDIUM)
            ];

            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                inputs
            );

            expect(result.success).toBe(true);
            const decoded = result.result.array;
            expect(decoded).toBeDefined();
            expect(decoded?.length).toBe(8);

            // Verify each return value
            expect(decoded?.[0]).toBe(12345n); // uint
            expect((decoded?.[1] as string).toLowerCase()).toBe(
                testAddress.toLowerCase()
            ); // address
            expect(decoded?.[2]).toBe(testBytes32); // bytes32
            expect(decoded?.[3]).toBe('Hello VeChain'); // string
            expect(decoded?.[4]).toEqual([100n, 200n, 300n]); // uint[3]
            expect(decoded?.[5]).toEqual([1n, 2n, 3n, 4n, 5n]); // uint[]

            // Struct verification
            const struct = decoded?.[6] as unknown as {
                id: bigint;
                name: string;
            };
            expect(struct.id).toBe(99n);
            expect(struct.name).toBe('Nested Struct');

            expect(decoded?.[7]).toBe(1); // enum
        });

        test('Should decode multiple return values with edge cases', async () => {
            const functionAbi = getFunctionAbi('multipleData');
            const emptyBytes32 =
                '0x0000000000000000000000000000000000000000000000000000000000000000';

            const inputs = [
                0n, // uint (zero)
                '0x0000000000000000000000000000000000000000', // zero address
                emptyBytes32, // empty bytes32
                '', // empty string
                [0n, 0n, 0n] as const, // zero fixed array
                [], // empty dynamic array
                { id: 0n, name: '' }, // empty struct
                0 // enum (SMALL)
            ];

            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                inputs
            );

            expect(result.success).toBe(true);
            const decoded = result.result.array;
            expect(decoded).toBeDefined();
            expect(decoded?.length).toBe(8);

            expect(decoded?.[0]).toBe(0n);
            expect(decoded?.[3]).toBe('');
            expect(decoded?.[4]).toEqual([0n, 0n, 0n]);
            expect(decoded?.[5]).toEqual([]);
        });
    });

    // ==================== State Variable Read ====================

    describe('State Variable Read', () => {
        test('Should decode state variable (uint256)', async () => {
            const functionAbi = getFunctionAbi('stateVariable');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                []
            );

            expect(result.success).toBe(true);
            // State variable is uint256
            expect(typeof result.result.plain).toBe('bigint');
        });
    });

    // ==================== View Function with State ====================

    describe('View Functions', () => {
        test('Should decode getBalance view function', async () => {
            const functionAbi = getFunctionAbi('getBalance');
            const result = await thorClient.contracts.executeCall(
                testingContractAddress,
                functionAbi,
                [testAddress]
            );

            expect(result.success).toBe(true);
            // Balance is uint256, defaults to 0 for unknown address
            expect(result.result.plain).toBe(0n);
        });
    });
});

/**
 * Integration tests for contract.read.<functionName>() - dynamically generated methods from ABI.
 * Tests that all Solidity return types are correctly decoded using the Contract class.
 *
 * @group solo
 */
describe('Contract.read Return Types Solo Tests', () => {
    let thorClient: ThorClient;
    let testingContractAddress: Address;
    let testingContractAbi: Abi;
    let soloConfig: ConfigData;

    // Test addresses
    const testAddress = '0x1234567890123456789012345678901234567890';

    beforeAll(() => {
        thorClient = ThorClient.at(ThorNetworks.SOLONET);
        soloConfig = getConfigData();
        testingContractAddress = Address.of(
            soloConfig.TESTING_CONTRACT_ADDRESS
        );
        testingContractAbi = soloConfig.TESTING_CONTRACT_ABI as Abi;
    });

    // ==================== Scalar Types via contract.read ====================

    describe('Scalar Types via contract.read', () => {
        test('Should decode bool via contract.read.boolData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).boolData(true);
            expect(result).toBe(true);

            const resultFalse = await (contract.read as any).boolData(false);
            expect(resultFalse).toBe(false);
        });

        test('Should decode int256 via contract.read.intData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const positiveResult = await (contract.read as any).intData(12345n);
            expect(positiveResult).toBe(12345n);

            const negativeResult = await (contract.read as any).intData(-12345n);
            expect(negativeResult).toBe(-12345n);
        });

        test('Should decode uint256 via contract.read.uintData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).uintData(
                99999999999999999999n
            );
            expect(result).toBe(99999999999999999999n);
        });

        test('Should decode address via contract.read.addressData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).addressData(testAddress);
            expect((result as string).toLowerCase()).toBe(
                testAddress.toLowerCase()
            );
        });

        test('Should decode bytes32 via contract.read.bytes32Data', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testValue =
                '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const result = await (contract.read as any).bytes32Data(testValue);
            expect(result).toBe(testValue);
        });

        test('Should decode string via contract.read.stringData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).stringData(
                'Hello, VeChain SDK!'
            );
            expect(result).toBe('Hello, VeChain SDK!');

            // Test with special characters
            const specialResult = await (contract.read as any).stringData(
                'Hello! @#$%^&*() 你好 🚀'
            );
            expect(specialResult).toBe('Hello! @#$%^&*() 你好 🚀');

            // Test empty string
            const emptyResult = await (contract.read as any).stringData('');
            expect(emptyResult).toBe('');
        });
    });

    // ==================== Array Types via contract.read ====================

    describe('Array Types via contract.read', () => {
        test('Should decode fixed-size array via contract.read.fixedArrayData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testValue = [1n, 2n, 3n] as const;
            const result = await (contract.read as any).fixedArrayData(
                testValue
            );
            expect(result).toEqual([1n, 2n, 3n]);
        });

        test('Should decode dynamic array via contract.read.dynamicArrayData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testValue = [10n, 20n, 30n, 40n, 50n];
            const result = await (contract.read as any).dynamicArrayData(
                testValue
            );
            expect(result).toEqual(testValue);

            // Test empty array
            const emptyResult = await (contract.read as any).dynamicArrayData(
                []
            );
            expect(emptyResult).toEqual([]);
        });

        test('Should decode large dynamic array via contract.read.dynamicArrayData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testValue = Array.from({ length: 100 }, (_, i) => BigInt(i));
            const result = await (contract.read as any).dynamicArrayData(
                testValue
            );
            expect(result).toEqual(testValue);
        });
    });

    // ==================== Struct Type via contract.read ====================

    describe('Struct Type via contract.read', () => {
        test('Should decode struct via contract.read.structData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testStruct = { id: 42n, name: 'Test Struct' };
            const result = await (contract.read as any).structData(testStruct);

            // Struct should be returned as object with named properties
            expect(result.id).toBe(42n);
            expect(result.name).toBe('Test Struct');
        });

        test('Should decode struct with empty values via contract.read.structData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testStruct = { id: 0n, name: '' };
            const result = await (contract.read as any).structData(testStruct);

            expect(result.id).toBe(0n);
            expect(result.name).toBe('');
        });
    });

    // ==================== Enum Type via contract.read ====================

    describe('Enum Type via contract.read', () => {
        test('Should decode enum via contract.read.enumData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const smallResult = await (contract.read as any).enumData(0);
            expect(smallResult).toBe(0);

            const mediumResult = await (contract.read as any).enumData(1);
            expect(mediumResult).toBe(1);

            const largeResult = await (contract.read as any).enumData(2);
            expect(largeResult).toBe(2);
        });
    });

    // ==================== Tuple / Multiple Return Values via contract.read ====================

    describe('Tuple / Multiple Return Values via contract.read', () => {
        test('Should decode multiple int values via contract.read.multipleIntData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).multipleIntData(
                255, // uint8
                65535, // uint16
                4294967295, // uint32
                18446744073709551615n, // uint64
                1461501637330902918203684832716283019655932542975n, // uint160
                115792089237316195423570985008687907853269984665640564039457584007913129639935n // uint256 (max)
            );

            // Multiple return values are returned as array
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(6);
            expect(result[0]).toBe(255);
            expect(result[1]).toBe(65535);
            expect(result[2]).toBe(4294967295);
            expect(result[3]).toBe(18446744073709551615n);
        });

        test('Should decode complex multiple return values via contract.read.multipleData', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const testBytes32 =
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';

            const result = await (contract.read as any).multipleData(
                12345n, // uint
                testAddress, // address
                testBytes32, // bytes32
                'Hello VeChain', // string
                [100n, 200n, 300n] as const, // uint[3] fixed array
                [1n, 2n, 3n, 4n, 5n], // uint[] dynamic array
                { id: 99n, name: 'Nested Struct' }, // struct
                1 // enum (MEDIUM)
            );

            // Multiple return values are returned as array
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(8);

            // Verify each return value
            expect(result[0]).toBe(12345n); // uint
            expect((result[1] as string).toLowerCase()).toBe(
                testAddress.toLowerCase()
            ); // address
            expect(result[2]).toBe(testBytes32); // bytes32
            expect(result[3]).toBe('Hello VeChain'); // string
            expect(result[4]).toEqual([100n, 200n, 300n]); // uint[3]
            expect(result[5]).toEqual([1n, 2n, 3n, 4n, 5n]); // uint[]

            // Struct verification
            expect(result[6].id).toBe(99n);
            expect(result[6].name).toBe('Nested Struct');

            expect(result[7]).toBe(1); // enum
        });
    });

    // ==================== State Variable via contract.read ====================

    describe('State Variable via contract.read', () => {
        test('Should read state variable via contract.read.stateVariable', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).stateVariable();
            // State variable is uint256
            expect(typeof result).toBe('bigint');
        });

        test('Should read balance mapping via contract.read.getBalance', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).getBalance(testAddress);
            // Balance defaults to 0 for unknown address
            expect(result).toBe(0n);
        });

        test('Should read balances mapping via contract.read.balances', async () => {
            const contract = thorClient.contracts.load(
                testingContractAddress,
                testingContractAbi
            );

            const result = await (contract.read as any).balances(testAddress);
            // Balance defaults to 0 for unknown address
            expect(result).toBe(0n);
        });
    });
});

