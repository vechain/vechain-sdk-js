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
 * Compiles a Solidity contract.
 *
 * Given a contract name and its sources, this function prepares the Solidity input,
 * compiles the contract using the Solidity compiler, and extracts the ABI and bytecode
 * from the compiled contract.
 *
 * @param contractName - The name of the contract to compile.
 * @param sources - The sources of the contract, containing Solidity source code.
 * @returns An object containing the name, ABI, and bytecode of the compiled contract.
 *
 * @example
 * const sources = {
 *   'HelloWorld.sol': {
 *     content: 'pragma solidity ^0.6.0; contract HelloWorld { function sayHello() public pure returns (string memory) { return "Hello, World!"; } }'
 *   }
 * };
 * const compiled = compileContract('HelloWorld', sources);
 * console.log(compiled);
 *
 * // Or with get contract source code helper
 * const sourcesWithGetSourceCode: Sources = {
 *         'Example.sol': {
 *             content: getContractSourceCode(
 *                 'tests/contract/sample',
 *                 'Example.sol'
 *             )
 *         }
 *     };
 *
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
    const solcCompiledContract = solc.compile(JSON.stringify(input));

    // Parse the compiled contract
    const compiledContract = JSON.parse(solcCompiledContract);

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
