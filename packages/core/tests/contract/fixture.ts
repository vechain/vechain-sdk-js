// Specify the path to your Solidity contract file
import path from 'path';
import fs from 'fs';
import { compileContract, type Contract, type Sources } from './compiler';
import { unitsUtils, VTHO_ADDRESS } from '../../src';
import { generateRandomValidAddress } from '../fixture';
import { InvalidDataTypeError } from '@vechain/vechain-sdk-errors';

const getContractSourceCode = (
    dirname: string,
    filename: string,
    importFromNodeModules: boolean = false
): string => {
    const contractPath = path.resolve(
        importFromNodeModules ? '../../node_modules/' + dirname : dirname,
        filename
    );

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
                '@openzeppelin/contracts/token/ERC20/',
                'ERC20.sol',
                true
            )
        },
        '@openzeppelin/contracts/token/ERC20/IERC20.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/token/ERC20/',
                'IERC20.sol',
                true
            )
        },
        '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/token/ERC20/',
                'extensions/IERC20Metadata.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/Context.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/',
                'Context.sol',
                true
            )
        },
        '@openzeppelin/contracts/interfaces/draft-IERC6093.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/interfaces/',
                'draft-IERC6093.sol',
                true
            )
        }
    };

    return compileContract('SampleToken', erc20Sources);
}

/**
 * Compiles the ERC721 sample NFT contract using a predefined set of sources.
 *
 * This function gathers various Solidity source files necessary for compiling
 * a sample ERC721 NFT contract. It pulls in the main contract file, `SampleNFT.sol`,
 * along with a series of OpenZeppelin contracts that implement ERC721 standards,
 * utility contracts, and interfaces.
 *
 * @returns A `Contract` object representing the compiled ERC721 NFT contract.
 *          This object is ready to be deployed or further interacted with.
 */
function compileERC721SampleNFTContract(): Contract {
    const erc721sources: Sources = {
        'SampleNFT.sol': {
            content: getContractSourceCode(
                'tests/contract/sample',
                'SampleNFT.sol'
            )
        },
        '@openzeppelin/contracts/token/ERC721/ERC721.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/token/ERC721/',
                'ERC721.sol',
                true
            )
        },
        '@openzeppelin/contracts/token/ERC721/IERC721.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/token/ERC721/',
                'IERC721.sol',
                true
            )
        },
        '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/token/ERC721/',
                'IERC721Receiver.sol',
                true
            )
        },
        '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/token/ERC721/extensions/',
                'IERC721Metadata.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/Context.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/',
                'Context.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/Strings.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/',
                'Strings.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/introspection/IERC165.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/introspection/',
                'IERC165.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/introspection/ERC165.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/introspection/',
                'ERC165.sol',
                true
            )
        },
        '@openzeppelin/contracts/interfaces/draft-IERC6093.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/interfaces/',
                'draft-IERC6093.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/math/Math.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/math/',
                'Math.sol',
                true
            )
        },
        '@openzeppelin/contracts/utils/math/SignedMath.sol': {
            content: getContractSourceCode(
                '@openzeppelin/contracts/utils/math/',
                'SignedMath.sol',
                true
            )
        }
    };

    return compileContract('SampleNFT', erc721sources);
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
    compileERC721SampleNFTContract,
    getContractSourceCode,
    transferTokenClausesTestCases,
    invalidTransferTokenClausesTestCases,
    transferVETtestCases,
    invalidTransferVETtestCases
};
