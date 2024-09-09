import { clauseBuilder, coder, type FunctionFragment } from '@vechain/sdk-core';
import { expect } from 'expect';
import { stringifyData } from '@vechain/sdk-errors';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';

// START_SNIPPET: ContractFunctionCallSnippet

// 1 - Init a simple contract ABI
const contractABI = [
    {
        constant: false,
        inputs: [
            {
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'setValue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getValue',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// 2 - Create a clause to call setValue(123)
const clause = clauseBuilder.functionInteraction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    coder
        .createInterface(contractABI)
        .getFunction('setValue') as FunctionFragment,
    [123]
);

// END_SNIPPET: ContractFunctionCallSnippet

// START_SNIPPET: ContractObjectFunctionCallSnippet

// 1 - Build the thor client and load the contract

const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

const contract = thorSoloClient.contracts.load(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    contractABI
);

// 2 - Create a clause to call setValue(123)
const setValueClause = contract.clause.setValue(123);

// END_SNIPPET: ContractObjectFunctionCallSnippet

// 3 - Check the parameters of the clause

expect(clause.to).toBe('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');
expect(clause.value).toBe(0);
expect(clause.data).toBeDefined();

expect(setValueClause.clause.to).toBe(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
);
expect(setValueClause.clause.value).toBe(0);
expect(setValueClause.clause.data).toBeDefined();
