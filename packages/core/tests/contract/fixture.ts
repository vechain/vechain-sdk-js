// Specify the path to your Solidity contract file
import path from 'path';
import fs from 'fs';
import { compileContract, type Contract, type Sources } from './compiler';

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

export { compileERC20SampleTokenContract, getContractSourceCode };
