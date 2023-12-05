/* eslint-disable */
import * as fs from 'fs';
import * as path from 'path';
var solc = require('solc');

interface Contract {
    name: string;
    abi: string;
    bytecode: string;
}

/**
 * Compile a Solidity contract located in a directory
 * @param dirname name of the directory where the contract is located
 * @param filename filename of the contract
 * @param contractName Name of the contract
 * @returns the name, abi, and bytecode of the contract
 */
function compileContract(
    dirname: string,
    filename: string,
    contractName: string
): Contract {
    // Specify the path to your Solidity contract file
    const contractPath = path.resolve(dirname, filename);

    // Read the Solidity source code from the file
    const contractSourceCode = fs.readFileSync(contractPath, 'utf8');

    // Define the Solidity input for the compiler
    const input = {
        language: 'Solidity',
        sources: {
            solidityContract: {
                content: contractSourceCode
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            },
            evmVersion: 'istanbul'
        }
    };

    // Compile the contract
    const compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));

    // Extract the bytecode from the compiled contract
    const bytecode =
        compiledContract.contracts['solidityContract'][contractName].evm
            .bytecode.object;

    const abi = JSON.stringify(
        compiledContract.contracts['solidityContract'][contractName].abi
    );

    return {
        name: contractName,
        abi: abi,
        bytecode: '0x' + bytecode
    };
}

export { compileContract };
