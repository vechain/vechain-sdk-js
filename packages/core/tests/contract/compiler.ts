/* eslint-disable */
import * as fs from 'fs';
import * as path from 'path';
var solc = require('solc');

interface Contract {
    name: string;
    abi: string;
    bytecode: string;
}

export interface Sources {
    [contractName: string]: { content: string };
}

// Main

/**
 * Compile a Solidity contract located in a directory
 * @param dirname name of the directory where the contract is located
 * @param filename filename of the contract
 * @param contractName Name of the contract
 * @returns the name, abi, and bytecode of the contract
 */
function compileContract(contractName: string, sources: Sources): Contract {
    // Define the Solidity input for the compiler
    const input = {
        language: 'Solidity',
        sources: sources,
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
        compiledContract.contracts[contractName + '.sol'][contractName].evm
            .bytecode.object;

    const abi = JSON.stringify(
        compiledContract.contracts[contractName + '.sol'][contractName].abi
    );

    return {
        name: contractName,
        abi: abi,
        bytecode: '0x' + bytecode
    };
}

export { compileContract };
