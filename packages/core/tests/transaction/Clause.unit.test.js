"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
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
        ],
        address: src_1.Address.of('0x742d35Cc6634C0532925a3b844Bc454e4438f44e'),
        bytecode: src_1.HexUInt.of('608060405234801561001057600080fd5b506040516102063803806102068339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610150806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212205afd59a6c45e89fb94e9e067818966a866fb7912880dd931923031b31555a92c64736f6c63430008160033')
    },
    from: src_1.Address.of('0x86ac45cd5ad5da8c63dc6a826e994e783c0883b3'),
    to: src_1.Address.of('0x051815fdc271780de69dd8959329b27d6604469e'),
    token: {
        address: src_1.Address.of('0x0000000000000000000000000000456e65726779')
    }
};
// Test token
class ETHTest extends src_1.Token {
    tokenAddress = src_1.Address.of('0xdDCc5e1704bCcEC81c5ef524C682109815F7E6e5');
    // 18 decimals
    units = src_1.Units.wei;
    name = 'EthTest';
    constructor(value, valueUnits) {
        super(); // Pass a default value
        this.initialize(value, valueUnits); // Call the initialization method
    }
}
/**
 * Test Clause class.
 * @group unit/transaction
 */
(0, globals_1.describe)('Clause class tests', () => {
    (0, globals_1.describe)('callFunction method tests', () => {
        (0, globals_1.test)('Return Clause <- call function', () => {
            const actual = src_1.Clause.callFunction(ClauseFixture.contract.address, src_1.ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction('set'), [1]);
            (0, globals_1.expect)(actual.to).toBe(ClauseFixture.contract.address.toString().toLowerCase());
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
            (0, globals_1.expect)(actual.data).toBeDefined();
        });
        (0, globals_1.test)('Return Clause <- VET value is zero', () => {
            const actual = src_1.Clause.callFunction(ClauseFixture.contract.address, src_1.ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction('set'), [1], src_1.VET.of(0));
            (0, globals_1.expect)(actual.to).toBe(ClauseFixture.contract.address.toString().toLowerCase());
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
            (0, globals_1.expect)(actual.data).toBeDefined();
        });
        (0, globals_1.test)('Return Clause <- call function & comment', () => {
            const comment = 'Setting x = 1.';
            const actual = src_1.Clause.callFunction(ClauseFixture.contract.address, src_1.ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction('set'), [1], undefined, { comment });
            (0, globals_1.expect)(actual.to).toBe(ClauseFixture.contract.address.toString().toLowerCase());
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
            (0, globals_1.expect)(actual.data).toBeDefined();
            (0, globals_1.expect)(actual.comment).toBe(comment);
            (0, globals_1.expect)(actual.abi).toBeUndefined();
        });
        (0, globals_1.test)('Return Clause <- call function & comment & abi', () => {
            const comment = 'Setting x = 1.';
            const actual = src_1.Clause.callFunction(ClauseFixture.contract.address, src_1.ABIContract.ofAbi(ClauseFixture.contract.abi).getFunction('set'), [1], undefined, { comment, includeABI: true });
            (0, globals_1.expect)(actual.to).toBe(ClauseFixture.contract.address.toString().toLowerCase());
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
            (0, globals_1.expect)(actual.data).toBeDefined();
            (0, globals_1.expect)(actual.comment).toBe(comment);
            (0, globals_1.expect)(actual.abi).toBeDefined();
        });
    });
    (0, globals_1.describe)('deployContract method tests', () => {
        (0, globals_1.test)('Return Clause <- contract bytecode', () => {
            const actual = src_1.Clause.deployContract(ClauseFixture.contract.bytecode);
            (0, globals_1.expect)(actual.data).toEqual(ClauseFixture.contract.bytecode.toString());
            (0, globals_1.expect)(actual.to).toBe(null);
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
        });
        (0, globals_1.test)('Return Clause <- contract bytecode & abi parameters', () => {
            const actual = src_1.Clause.deployContract(ClauseFixture.contract.bytecode, {
                types: 'uint256',
                values: ['100']
            });
            (0, globals_1.expect)(actual.to).toBe(null);
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
            (0, globals_1.expect)(actual.data.length).toBeGreaterThan(ClauseFixture.contract.bytecode.toString().length);
        });
        (0, globals_1.test)('Return Clause <- contract bytecode & comment', () => {
            const comment = 'Deploying a contract with a comment';
            const actual = src_1.Clause.deployContract(ClauseFixture.contract.bytecode, undefined, { comment });
            (0, globals_1.expect)(actual.to).toBe(null);
            (0, globals_1.expect)(actual.amount().isZero()).toBe(true);
            (0, globals_1.expect)(actual.data).toEqual(ClauseFixture.contract.bytecode.toString());
            (0, globals_1.expect)(actual.comment).toBe(comment);
        });
    });
    (0, globals_1.describe)('transferNFT method tests', () => {
        (0, globals_1.test)('Return Clause <- transfer NFT', () => {
            const expected = {
                to: ClauseFixture.contract.address.toString().toLowerCase(),
                value: `0x0`,
                data: src_1.ABIContract.ofAbi(src_1.ERC721_ABI)
                    .encodeFunctionInput('transferFrom', [
                    ClauseFixture.from.toString().toLowerCase(),
                    ClauseFixture.to.toString().toLowerCase(),
                    '0'
                ])
                    .toString()
            };
            const actual = src_1.Clause.transferNFT(ClauseFixture.contract.address, ClauseFixture.from, ClauseFixture.to, src_1.HexUInt.of(0));
            (0, globals_1.expect)(actual.clause).toEqual(expected);
        });
    });
    (0, globals_1.describe)('transferVTHOToken method tests', () => {
        (0, globals_1.test)('Return Clause <- 1 wei VTHO', () => {
            const expected = {
                to: src_1.Address.of(src_1.VTHO_ADDRESS).toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000000000000000000000000001`,
                comment: 'Transfer VTHO'
            };
            const actual = src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(1, src_1.Units.wei));
            (0, globals_1.expect)(actual.clause).toEqual(expected);
            (0, globals_1.expect)(actual.functionAbi).toBeDefined();
            (0, globals_1.expect)(actual.functionAbi.stringSignature).toBe('transfer(address,uint256)');
        });
        (0, globals_1.test)('Return Clause <- 100 wei VTHO', () => {
            const expectedClause = {
                to: src_1.Address.of(src_1.VTHO_ADDRESS).toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000000000000000000000000064`,
                comment: 'Transfer VTHO'
            };
            const actual = src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(0.1, src_1.Units.kwei));
            (0, globals_1.expect)(actual.clause).toEqual(expectedClause);
            (0, globals_1.expect)(actual.functionAbi).toBeDefined();
            (0, globals_1.expect)(actual.functionAbi.stringSignature).toBe('transfer(address,uint256)');
        });
        (0, globals_1.test)('Return Clause <- 1 VTHO', () => {
            const expectedClause = {
                to: src_1.Address.of(src_1.VTHO_ADDRESS).toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000000000000de0b6b3a7640000`,
                comment: 'Transfer VTHO'
            };
            const actual = src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(1));
            (0, globals_1.expect)(actual.clause).toEqual(expectedClause);
            (0, globals_1.expect)(actual.functionAbi).toBeDefined();
            (0, globals_1.expect)(actual.functionAbi.stringSignature).toBe('transfer(address,uint256)');
        });
        (0, globals_1.test)('Return Clause <- 500000000 VTHO', () => {
            const expectedClause = {
                to: src_1.Address.of(src_1.VTHO_ADDRESS).toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000019d971e4fe8401e74000000`,
                comment: 'Transfer VTHO'
            };
            const actual = src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(500000000n));
            (0, globals_1.expect)(actual.clause).toEqual(expectedClause);
            (0, globals_1.expect)(actual.functionAbi).toBeDefined();
            (0, globals_1.expect)(actual.functionAbi.stringSignature).toBe('transfer(address,uint256)');
        });
        (0, globals_1.test)('Throw error <- negative amount VTHO', () => {
            (0, globals_1.expect)(() => {
                src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(-100));
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw <- infinite amount VTHO', () => {
            (0, globals_1.expect)(() => {
                src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(Infinity));
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw <- NaN amount VTHO', () => {
            (0, globals_1.expect)(() => {
                src_1.Clause.transferVTHOToken(ClauseFixture.to, src_1.VTHO.of(NaN));
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('transferVET method tests', () => {
        (0, globals_1.test)('Return Clause <- 1 wei VET', () => {
            const expected = {
                to: ClauseFixture.to.toString().toLowerCase(),
                value: `0x1`,
                data: '0x',
                comment: 'Transferring 1 wei VET.'
            };
            const actual = src_1.Clause.transferVET(ClauseFixture.to, src_1.VET.of(1, src_1.Units.wei), { comment: expected.comment });
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        (0, globals_1.test)('Return Clause <- 100 wei VET', () => {
            const expected = {
                to: ClauseFixture.to.toString().toLowerCase(),
                value: `0x64`,
                data: '0x'
            };
            const actual = src_1.Clause.transferVET(ClauseFixture.to, src_1.VET.of('0.1', src_1.Units.kwei));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        (0, globals_1.test)('Return Clause <- 500000000 VET', () => {
            const expected = {
                to: ClauseFixture.to.toString().toLowerCase(),
                value: '0x19d971e4fe8401e74000000',
                data: '0x'
            };
            const actual = src_1.Clause.transferVET(ClauseFixture.to, src_1.VET.of(500000000n));
            (0, globals_1.expect)(actual).toEqual(expected);
        });
        (0, globals_1.test)('Throw <- infinite amount VET', () => {
            (0, globals_1.expect)(() => {
                src_1.Clause.transferVET(ClauseFixture.to, src_1.VET.of(Infinity));
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw <- NaN amount VET', () => {
            (0, globals_1.expect)(() => {
                src_1.Clause.transferVET(ClauseFixture.to, src_1.VET.of(NaN));
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.test)('Throw <- negative amount VET', () => {
            (0, globals_1.expect)(() => {
                src_1.Clause.transferVET(ClauseFixture.to, src_1.VET.of(-123.45));
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
    });
    (0, globals_1.describe)('transferToken method tests', () => {
        (0, globals_1.test)('Return Clause <- 1 eth Token', () => {
            const token = new ETHTest(1n, src_1.Units.ether);
            const expected = {
                to: token.tokenAddress.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000000000000de0b6b3a7640000`,
                comment: 'Transfer EthTest'
            };
            const actual = src_1.Clause.transferToken(ClauseFixture.to, token);
            (0, globals_1.expect)(actual.clause).toEqual(expected);
        });
        (0, globals_1.test)('Return Clause <- 100 wei Token', () => {
            const token = new ETHTest(100n, src_1.Units.wei);
            const expected = {
                to: token.tokenAddress.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000000000000000000000000064`,
                comment: 'Transfer EthTest'
            };
            const actual = src_1.Clause.transferToken(ClauseFixture.to, token);
            (0, globals_1.expect)(actual.clause).toEqual(expected);
        });
        (0, globals_1.test)('Return Clause <- 1 wei Token', () => {
            const token = new ETHTest(1n, src_1.Units.wei);
            const expected = {
                to: token.tokenAddress.toString().toLowerCase(),
                value: `0x0`,
                data: `0xa9059cbb000000000000000000000000${ClauseFixture.to
                    .toString()
                    .toLowerCase()
                    .slice(2)}0000000000000000000000000000000000000000000000000000000000000001`,
                comment: 'Transfer EthTest'
            };
            const actual = src_1.Clause.transferToken(ClauseFixture.to, token);
            (0, globals_1.expect)(actual.clause).toEqual(expected);
        });
    });
});
