import { describe, expect, test } from '@jest/globals';
import {
    ABI,
    ABIFunction,
    ABIEvent,
    ABIContract
} from '../../../../src/thor/thor-client/contracts/model/ABI';
import { IllegalArgumentError } from '../../../../src/common/errors';

/**
 * @group unit/contracts/abi
 */
describe('ABI Classes', () => {
    describe('ABIItem (via ABIEvent)', () => {
        // ABIItem is abstract, so we test through ABIEvent which extends it
        test('Should create ABIItem with signature', () => {
            const signature =
                'event Transfer(address indexed from, address indexed to, uint256 value)';
            const abiItem = new ABIEvent(signature);

            expect(abiItem.toString()).toBe(signature);
            expect(abiItem.bytes).toEqual(new TextEncoder().encode(signature));
        });

        test('Should throw IllegalArgumentError for bi getter', () => {
            const abiItem = new ABIEvent(
                'event Test(uint256 indexed value)'
            );

            expect(() => abiItem.bi).toThrow(IllegalArgumentError);
        });

        test('Should throw IllegalArgumentError for n getter', () => {
            const abiItem = new ABIEvent(
                'event Test(uint256 indexed value)'
            );

            expect(() => abiItem.n).toThrow(IllegalArgumentError);
        });

        test('Should compare ABIItems correctly', () => {
            const item1 = new ABIEvent(
                'event Transfer(address indexed from, address indexed to, uint256 value)'
            );
            const item2 = new ABIEvent(
                'event Transfer(address indexed from, address indexed to, uint256 value)'
            );
            const item3 = new ABIEvent(
                'event Approval(address indexed owner, address indexed spender, uint256 value)'
            );

            expect(item1.compareTo(item2)).toBe(0);
            expect(item1.compareTo(item3)).toBeGreaterThan(0);
            expect(item3.compareTo(item1)).toBeLessThan(0);
        });
    });

    describe('ABI', () => {
        const testTypes = [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ];
        const testValues = [
            '0x1234567890123456789012345678901234567890',
            1000n
        ];

        test('Should create ABI with types and values', () => {
            const abi = new ABI(testTypes, testValues);

            expect(abi.types).toEqual(testTypes);
            expect(abi.values).toEqual(testValues);
        });

        test('Should throw IllegalArgumentError for bi getter', () => {
            const abi = new ABI(testTypes, testValues);

            expect(() => abi.bi).toThrow(IllegalArgumentError);
        });

        test('Should throw IllegalArgumentError for n getter', () => {
            const abi = new ABI(testTypes, testValues);

            expect(() => abi.n).toThrow(IllegalArgumentError);
        });

        test('Should encode ABI data', () => {
            const abi = new ABI(testTypes, testValues);
            const encoded = abi.encode();

            expect(encoded).toBeInstanceOf(Uint8Array);
            expect(encoded.length).toBeGreaterThan(0);
        });

        test('Should create ABI from encoded data', () => {
            const abi = new ABI(testTypes, testValues);
            const encoded = abi.encode();
            const decoded = ABI.ofEncoded(testTypes, encoded);

            expect(decoded).toBeInstanceOf(ABI);
            expect(decoded.types).toEqual(testTypes);
        });

        test('Should get first value', () => {
            const abi = new ABI(testTypes, testValues);
            const firstValue = abi.first();

            expect(firstValue).toBe(testValues[0]);
        });

        test('Should compare ABIs correctly', () => {
            const abi1 = new ABI(testTypes, testValues);
            const abi2 = new ABI(testTypes, testValues);
            const abi3 = new ABI(testTypes, [testValues[0], 2000n]);

            expect(abi1.compareTo(abi2)).toBe(0);
            expect(abi1.compareTo(abi3)).not.toBe(0);
        });
    });

    describe('ABIFunction', () => {
        const testAbi = [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ];
        const functionName = 'transfer';
        const signature = 'transfer(address,uint256)';

        test('Should create ABIFunction', () => {
            const abiFunction = new ABIFunction(
                testAbi,
                functionName,
                signature
            );

            expect(abiFunction.name).toBe(functionName);
            expect(abiFunction.signature).toBe(signature);
        });

        test('Should decode function data', () => {
            const abiFunction = new ABIFunction(
                testAbi,
                functionName,
                signature
            );
            const testData =
                '0x000000000000000000000000123456789012345678901234567890123456789000000000000000000000000000000000000000000000000000000000000003e8';

            const decoded = abiFunction.decodeData(testData);

            expect(Array.isArray(decoded)).toBe(true);
        });

        test('Should encode function data', () => {
            const abiFunction = new ABIFunction(
                testAbi,
                functionName,
                signature
            );
            const args = ['0x1234567890123456789012345678901234567890', 1000n];

            const encoded = abiFunction.encodeData(args);

            expect(typeof encoded).toBe('string');
            expect(encoded.startsWith('0x')).toBe(true);
        });

        test('Should throw IllegalArgumentError for invalid decode data', () => {
            const abiFunction = new ABIFunction(
                testAbi,
                functionName,
                signature
            );
            const invalidData = 'invalid_data';

            expect(() => abiFunction.decodeData(invalidData)).toThrow(
                IllegalArgumentError
            );
        });

        test('Should throw IllegalArgumentError for invalid encode data', () => {
            const abiFunction = new ABIFunction(
                testAbi,
                functionName,
                signature
            );
            const invalidArgs = ['invalid_address'];

            expect(() => abiFunction.encodeData(invalidArgs)).toThrow(
                IllegalArgumentError
            );
        });
    });

    describe('ABIEvent', () => {
        const testAbi = [
            { name: 'from', type: 'address', indexed: true },
            { name: 'to', type: 'address', indexed: true },
            { name: 'value', type: 'uint256', indexed: false }
        ];
        const eventName = 'Transfer';
        const signature = 'Transfer(address,address,uint256)';

        test('Should create ABIEvent', () => {
            const abiEvent = new ABIEvent(testAbi, eventName, signature);

            expect(abiEvent.name).toBe(eventName);
            expect(abiEvent.signature).toBe(signature);
        });

        test('Should decode event log', () => {
            const abiEvent = new ABIEvent(testAbi, eventName, signature);
            const eventData = {
                data: '0x00000000000000000000000000000000000000000000000000000000000003e8',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000001234567890123456789012345678901234567890',
                    '0x0000000000000000000000009876543210987654321098765432109876543210'
                ]
            };

            const decoded = abiEvent.decodeEventLog(eventData);

            // Returns an object with eventName and args (named parameters)
            expect(decoded).toHaveProperty('eventName', 'Transfer');
            expect(decoded).toHaveProperty('args');
            expect(decoded.args).toHaveProperty('from');
            expect(decoded.args).toHaveProperty('to');
            expect(decoded.args).toHaveProperty('value');
            expect(decoded.args.value).toBe(1000n);
        });

        test('Should create ABIEvent from signature string', () => {
            const signatureString =
                'event Transfer(address indexed from, address indexed to, uint256 value)';
            const abiEvent = new ABIEvent(signatureString);

            expect(abiEvent.name).toBe('Transfer');
            expect(abiEvent.signature).toBe(signatureString);
        });

        test('Should encode filter topics with null values', () => {
            const signatureString =
                'event Transfer(address indexed from, address indexed to, uint256 value)';
            const abiEvent = new ABIEvent(signatureString);

            const topics = abiEvent.encodeFilterTopics([
                null, // skip 'from'
                '0xFf0F343772Ae053f6DDB2885EA9DF1d301E222f6' // filter by 'to'
            ]);

            expect(topics).toHaveLength(3);
            expect(topics[0]).toBe(
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
            );
            expect(topics[1]).toBeNull();
            expect(topics[2]).toBe(
                '0x000000000000000000000000ff0f343772ae053f6ddb2885ea9df1d301e222f6'
            );
        });

        test('Should encode event log', () => {
            const abiEvent = new ABIEvent(testAbi, eventName, signature);
            const args = [
                '0x1234567890123456789012345678901234567890',
                '0x9876543210987654321098765432109876543210',
                1000n
            ];

            const encoded = abiEvent.encodeEventLog(args);

            expect(encoded).toHaveProperty('data');
            expect(encoded).toHaveProperty('topics');
            expect(typeof encoded.data).toBe('string');
            expect(Array.isArray(encoded.topics)).toBe(true);
        });

        test('Should throw IllegalArgumentError for invalid decode log', () => {
            const abiEvent = new ABIEvent(testAbi, eventName, signature);
            const invalidEventData = { data: 'invalid', topics: [] };

            expect(() => abiEvent.decodeEventLog(invalidEventData)).toThrow(
                IllegalArgumentError
            );
        });

        test('Should throw IllegalArgumentError for invalid encode log', () => {
            const abiEvent = new ABIEvent(testAbi, eventName, signature);
            const invalidArgs = ['invalid_address'];

            expect(() => abiEvent.encodeEventLog(invalidArgs)).toThrow(
                IllegalArgumentError
            );
        });
    });

    describe('ABIContract', () => {
        const testViemABI = [
            {
                type: 'function',
                name: 'transfer',
                inputs: [
                    { name: 'to', type: 'address' },
                    { name: 'amount', type: 'uint256' }
                ],
                outputs: [{ name: '', type: 'bool' }],
                stateMutability: 'nonpayable'
            },
            {
                type: 'function',
                name: 'balanceOf',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view'
            },
            {
                type: 'event',
                name: 'Transfer',
                inputs: [
                    { name: 'from', type: 'address', indexed: true },
                    { name: 'to', type: 'address', indexed: true },
                    { name: 'value', type: 'uint256', indexed: false }
                ]
            }
        ] as const;

        test('Should create ABIContract', () => {
            const abiContract = new ABIContract(testViemABI);

            expect(abiContract.abi).toEqual(testViemABI);
        });

        test('Should get function by name', () => {
            const abiContract = new ABIContract(testViemABI);

            const transferFunction = abiContract.getFunction('transfer');

            expect(transferFunction).toBeInstanceOf(Object);
            expect(transferFunction.name).toBe('transfer');
        });

        test('Should get event by name', () => {
            const abiContract = new ABIContract(testViemABI);

            const transferEvent = abiContract.getEvent('Transfer');

            expect(transferEvent).toBeInstanceOf(Object);
            expect(transferEvent.name).toBe('Transfer');
        });

        test('Should throw IllegalArgumentError for non-existent function', () => {
            const abiContract = new ABIContract(testViemABI);

            expect(() => abiContract.getFunction('nonExistent')).toThrow(
                IllegalArgumentError
            );
        });

        test('Should throw IllegalArgumentError for non-existent event', () => {
            const abiContract = new ABIContract(testViemABI);

            expect(() => abiContract.getEvent('NonExistent')).toThrow(
                IllegalArgumentError
            );
        });

        test('Should handle empty ABI', () => {
            const emptyABI = [] as const;
            const abiContract = new ABIContract(emptyABI);

            expect(abiContract.abi).toEqual(emptyABI);
            expect(() => abiContract.getFunction('any')).toThrow(
                IllegalArgumentError
            );
            expect(() => abiContract.getEvent('any')).toThrow(
                IllegalArgumentError
            );
        });
    });

    describe('Error Handling', () => {
        test('Should throw IllegalArgumentError with proper context', () => {
            const signature = 'event Test(uint256 indexed value)';
            const abiItem = new ABIEvent(signature);

            try {
                abiItem.bi;
            } catch (error: unknown) {
                expect(error).toBeInstanceOf(IllegalArgumentError);
                expect((error as IllegalArgumentError).message).toContain(
                    'ABIItem cannot be represented as bigint'
                );
                expect((error as IllegalArgumentError).args).toHaveProperty(
                    'signature',
                    signature
                );
            }
        });

        test('Should throw IllegalArgumentError for ABI encoding failure', () => {
            const invalidTypes = [{ name: 'invalid', type: 'invalid_type' }];
            const invalidValues = ['invalid_value'];

            expect(() => {
                const abi = new ABI(invalidTypes, invalidValues);
                abi.encode();
            }).toThrow(IllegalArgumentError);
        });

        test('Should throw IllegalArgumentError for ABI decoding failure', () => {
            const invalidData = new Uint8Array([0x00, 0x01, 0x02]);

            expect(() => {
                ABI.ofEncoded([{ name: 'test', type: 'uint256' }], invalidData);
            }).toThrow(IllegalArgumentError);
        });
    });
});
