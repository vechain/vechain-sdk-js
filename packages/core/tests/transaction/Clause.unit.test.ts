import { describe, expect, test } from '@jest/globals';
import {
    Address,
    Clause,
    ERC721_ABI,
    HexUInt,
    IllegalArgumentError,
    Units,
    VET,
    VTHO,
    type ClauseOptions,
    type DeployParams,
    type TransactionClause,
    ABIContract
} from '../../src';

const ClauseFixture = {
    contract: {
        abi: [
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'initialValue',
                        type: 'uint256'
                    }
                ],
                stateMutability: 'nonpayable',
                type: 'constructor'
            },
            {
                inputs: [],
                name: 'get',
                outputs: [
                    {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256'
                    }
                ],
                stateMutability: 'view',
                type: 'function'
            },
            {
                inputs: [
                    {
                        internalType: 'uint256',
                        name: 'x',
                        type: 'uint256'
                    }
                ],
                name: 'set',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ] as const,
        address: Address.of('0x742d35Cc6634C0532925a3b844Bc454e4438f44e'),
        bytecode: HexUInt.of(
            '608060405234801561001057600080fd5b506040516102063803806102068339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610150806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212205afd59a6c45e89fb94e9e067818966a866fb7912880dd931923031b31555a92c64736f6c63430008160033'
        )
    },
    from: Address.of('0x86ac45cd5ad5da8c63dc6a826e994e783c0883b3'),
    to: Address.of('0x051815fdc271780de69dd8959329b27d6604469e'),
    token: {
        address: Address.of('0x0000000000000000000000000000456e65726779')
    }
};

/**
 * Test Clause class.
 * @group unit/transaction
 */
describe('Clause class tests', () => {
    describe('callFunction method tests', () => {
        test('Return Clause <- call function', () => {
            const actual = Clause.callFunction(
                ClauseFixture.contract.address,
                ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction(
                    'set'
                ),
                [1]
            );
            expect(actual.to).toBe(
                ClauseFixture.contract.address.toString().toLowerCase()
            );
            expect(actual.amount().isZero()).toBe(true);
            expect(actual.data).toBeDefined();
        });

        test('Return Clause <- call function & comment', () => {
            const comment = 'Setting x = 1.';
            const actual = Clause.callFunction(
                ClauseFixture.contract.address,
                ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction(
                    'set'
                ),
                [1],
                undefined,
                { comment }
            );
            expect(actual.to).toBe(
                ClauseFixture.contract.address.toString().toLowerCase()
            );
            expect(actual.amount().isZero()).toBe(true);
            expect(actual.data).toBeDefined();
            expect(actual.comment).toBe(comment);
            expect(actual.abi).toBeUndefined();
        });

        test('Return Clause <- call function & comment & abi', () => {
            const comment = 'Setting x = 1.';
            const actual = Clause.callFunction(
                ClauseFixture.contract.address,
                ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction(
                    'set'
                ),
                [1],
                undefined,
                { comment, includeABI: true }
            );
            expect(actual.to).toBe(
                ClauseFixture.contract.address.toString().toLowerCase()
            );
            expect(actual.amount().isZero()).toBe(true);
            expect(actual.data).toBeDefined();
            expect(actual.comment).toBe(comment);
            expect(actual.abi).toBeDefined();
        });
    });

    describe('deployContract method tests', () => {
        test('Return Clause <- contract bytecode', () => {
            const actual = Clause.deployContract(
                ClauseFixture.contract.bytecode
            );
            expect(actual.data).toEqual(
                ClauseFixture.contract.bytecode.toString()
            );
            expect(actual.to).toBe(null);
            expect(actual.amount().isZero()).toBe(true);
        });

        test('Return Clause <- contract bytecode & abi parameters', () => {
            const actual = Clause.deployContract(
                ClauseFixture.contract.bytecode,
                {
                    types: 'uint256',
                    values: ['100']
                } satisfies DeployParams
            );
            expect(actual.to).toBe(null);
            expect(actual.amount().isZero()).toBe(true);
            expect(actual.data.length).toBeGreaterThan(
                ClauseFixture.contract.bytecode.toString().length
            );
        });

        test('Return Clause <- contract bytecode & comment', () => {
            const comment = 'Deploying a contract with a comment';
            const actual = Clause.deployContract(
                ClauseFixture.contract.bytecode,
                undefined,
                { comment } satisfies ClauseOptions
            );
            expect(actual.to).toBe(null);
            expect(actual.amount().isZero()).toBe(true);
            expect(actual.data).toEqual(
                ClauseFixture.contract.bytecode.toString()
            );
            expect(actual.comment).toBe(comment);
        });
    });

    describe('transferNFT method tests', () => {
        test('Return Clause <- transfer NFT', () => {
            const expected = {
                to: ClauseFixture.contract.address.toString().toLowerCase(),
                value: `0x0`,
                data: ABIContract.ofAbi(ERC721_ABI)
                    .encodeFunctionInput('transferFrom', [
                        ClauseFixture.from.toString().toLowerCase(),
                        ClauseFixture.to.toString().toLowerCase(),
                        '0'
                    ])
                    .toString()
            };
            const actual = Clause.transferNFT(
                ClauseFixture.contract.address,
                ClauseFixture.from,
                ClauseFixture.to,
                HexUInt.of(0)
            );
            expect(actual).toEqual(expected);
        });
    });

    describe('transferToken method tests', () => {
        test('Return Clause <- 1 wei VTHO', () => {
            const expected = {
                to: ClauseFixture.token.address.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(
                        2
                    )}0000000000000000000000000000000000000000000000000000000000000001`
            } satisfies TransactionClause;
            const actual = Clause.transferToken(
                ClauseFixture.token.address,
                ClauseFixture.to,
                VTHO.of(1, Units.wei)
            );
            expect(actual).toEqual(expected);
        });

        test('Return Clause <- 100 wei VTHO', () => {
            const expected = {
                to: ClauseFixture.token.address.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(
                        2
                    )}0000000000000000000000000000000000000000000000000000000000000064`
            } satisfies TransactionClause;
            const actual = Clause.transferToken(
                ClauseFixture.token.address,
                ClauseFixture.to,
                VTHO.of(0.1, Units.kwei)
            );
            expect(actual).toEqual(expected);
        });

        test('Return Clause <- 1 VTHO', () => {
            const expected = {
                to: ClauseFixture.token.address.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(
                        2
                    )}0000000000000000000000000000000000000000000000000de0b6b3a7640000`
            } satisfies TransactionClause;
            const actual = Clause.transferToken(
                ClauseFixture.token.address,
                ClauseFixture.to,
                VTHO.of(1)
            );
            expect(actual).toEqual(expected);
        });

        test('Return Clause <- 500000000 VTHO', () => {
            const expected = {
                to: ClauseFixture.token.address.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(
                        2
                    )}0000000000000000000000000000000000000000019d971e4fe8401e74000000`
            } satisfies TransactionClause;
            const actual = Clause.transferToken(
                ClauseFixture.token.address,
                ClauseFixture.to,
                VTHO.of(500000000n)
            );
            expect(actual).toEqual(expected);
        });

        test('Throw error <- negative amount VTHO', () => {
            expect(() => {
                Clause.transferToken(
                    ClauseFixture.token.address,
                    ClauseFixture.to,
                    VTHO.of(-100)
                );
            }).toThrow(IllegalArgumentError);
        });

        test('Throw <- infinite amount VTHO', () => {
            expect(() => {
                Clause.transferToken(
                    ClauseFixture.token.address,
                    ClauseFixture.to,
                    VTHO.of(Infinity)
                );
            }).toThrow(IllegalArgumentError);
        });

        test('Throw <- NaN amount VTHO', () => {
            expect(() => {
                Clause.transferToken(
                    ClauseFixture.token.address,
                    ClauseFixture.to,
                    VTHO.of(NaN)
                );
            }).toThrow(IllegalArgumentError);
        });
    });

    describe('transferVET method tests', () => {
        test('Return Clause <- 1 wei VET', () => {
            const expected = {
                to: ClauseFixture.to.toString().toLowerCase(),
                value: `0x1`,
                data: '0x',
                comment: 'Transferring 1 wei VET.'
            } satisfies TransactionClause;
            const actual = Clause.transferVET(
                ClauseFixture.to,
                VET.of(1, Units.wei),
                { comment: expected.comment }
            ) as TransactionClause;
            expect(actual).toEqual(expected);
        });

        test('Return Clause <- 100 wei VET', () => {
            const expected = {
                to: ClauseFixture.to.toString().toLowerCase(),
                value: `0x64`,
                data: '0x'
            } satisfies TransactionClause;
            const actual = Clause.transferVET(
                ClauseFixture.to,
                VET.of('0.1', Units.kwei)
            ) as TransactionClause;
            expect(actual).toEqual(expected);
        });

        test('Return Clause <- 500000000 VET', () => {
            const expected = {
                to: ClauseFixture.to.toString().toLowerCase(),
                value: '0x19d971e4fe8401e74000000',
                data: '0x'
            } satisfies TransactionClause;
            const actual = Clause.transferVET(
                ClauseFixture.to,
                VET.of(500000000n)
            ) as TransactionClause;
            expect(actual).toEqual(expected);
        });

        test('Throw <- infinite amount VET', () => {
            expect(() => {
                Clause.transferVET(ClauseFixture.to, VET.of(Infinity));
            }).toThrow(IllegalArgumentError);
        });

        test('Throw <- NaN amount VET', () => {
            expect(() => {
                Clause.transferVET(ClauseFixture.to, VET.of(NaN));
            }).toThrow(IllegalArgumentError);
        });

        test('Throw <- negative amount VET', () => {
            expect(() => {
                Clause.transferVET(ClauseFixture.to, VET.of(-123.45));
            }).toThrow(IllegalArgumentError);
        });
    });
});
