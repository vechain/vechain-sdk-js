// Specify the path to your Solidity contract file
import path from 'path';
import fs from 'fs';
import { compileContract, type Contract, type Sources } from './compiler';
import { unitsUtils, VTHO_ADDRESS } from '../../src';
import { generateRandomValidAddress } from '../fixture';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

const getContractSourceCode = (dirname: string, filename: string): string => {
    const contractPath = path.resolve(dirname, filename);

    // Read the Solidity source code from the file
    return fs.readFileSync(contractPath, 'utf8');
};

/**
 * Compiles the ERC20 Sample Token contract.
 *
 * This function gathers the necessary Solidity source files for the SampleToken contract
 * and its dependencies, then triggers the compilation process.
 * The function assumes the use of OpenZeppelin's ERC20 implementation and related contracts.
 *
 * @returns {Contract} An object representing the compiled contract, ready for deployment or further manipulation.
 */
function compileERC20SampleTokenContract(): Contract {
    const erc20Sources: Sources = {
        'SampleToken.sol': {
            content: getContractSourceCode(
                'tests/contract/sample',
                'SampleToken.sol'
            )
        },
        '@openzeppelin/contracts/token/ERC20/ERC20.sol': {
            content: getContractSourceCode(
                '../../node_modules/@openzeppelin/contracts/token/ERC20/',
                'ERC20.sol'
            )
        },
        '@openzeppelin/contracts/token/ERC20/IERC20.sol': {
            content: getContractSourceCode(
                '../../node_modules/@openzeppelin/contracts/token/ERC20/',
                'IERC20.sol'
            )
        },
        '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol': {
            content: getContractSourceCode(
                '../../node_modules/@openzeppelin/contracts/token/ERC20/',
                'extensions/IERC20Metadata.sol'
            )
        },
        '@openzeppelin/contracts/utils/Context.sol': {
            content: getContractSourceCode(
                '../../node_modules/@openzeppelin/contracts/utils/',
                'Context.sol'
            )
        },
        '@openzeppelin/contracts/interfaces/draft-IERC6093.sol': {
            content: getContractSourceCode(
                '../../node_modules/@openzeppelin/contracts/interfaces/',
                'draft-IERC6093.sol'
            )
        }
    };

    return compileContract('SampleToken', erc20Sources);
}

/**
 * Generates a random valid address.
 */
const recipientAddress = generateRandomValidAddress();

/**
 * Test cases for building clauses for transferring VIP180 tokens.
 */
const transferTokenClausesTestCases = [
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: 1,
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000001`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: '1',
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000001`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: unitsUtils.parseVET('1'),
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000de0b6b3a7640000`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: unitsUtils.parseVET('500000000'),
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000019d971e4fe8401e74000000`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: Number(unitsUtils.parseUnits('1', 2)),
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000064`
        }
    }
];

/**
 * Test cases for building clauses for transferring VIP180 tokens.
 */
const invalidTransferTokenClausesTestCases = [
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: Number(unitsUtils.parseUnits('-1', 2)),
        expectedError: InvalidDataTypeError
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: -1,
        expectedError: InvalidDataTypeError
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: '1,2',
        expectedError: InvalidDataTypeError
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: 1.7,
        expectedError: InvalidDataTypeError
    }
];

/**
 * Test cases for building clauses for transferring VET.
 */
const transferVETtestCases = [
    {
        recipientAddress,
        amount: 1,
        expected: {
            to: recipientAddress,
            value: '0x1',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: '1',
        expected: {
            to: recipientAddress,
            value: '0x1',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: unitsUtils.parseVET('1'),
        expected: {
            to: recipientAddress,
            value: '0xde0b6b3a7640000',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: unitsUtils.parseVET('500000000'),
        expected: {
            to: recipientAddress,
            value: '0x19d971e4fe8401e74000000',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: Number(unitsUtils.parseUnits('1', 2)),
        expected: {
            to: recipientAddress,
            value: '0x64',
            data: '0x'
        }
    }
];

/**
 * Invalid Test cases for building clauses for transferring VET.
 */
const invalidTransferVETtestCases = [
    {
        recipientAddress,
        amount: Number(unitsUtils.parseUnits('-1', 2)),
        expectedError: InvalidDataTypeError
    },
    {
        recipientAddress,
        amount: -1,
        expectedError: InvalidDataTypeError
    },
    {
        recipientAddress,
        amount: '1,2',
        expectedError: InvalidDataTypeError
    },
    {
        recipientAddress,
        amount: '1.2',
        expectedError: InvalidDataTypeError
    },
    {
        recipientAddress,
        amount: 1.7,
        expectedError: InvalidDataTypeError
    }
];

export {
    compileERC20SampleTokenContract,
    getContractSourceCode,
    transferTokenClausesTestCases,
    invalidTransferTokenClausesTestCases,
    transferVETtestCases,
    invalidTransferVETtestCases
};
