/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import fs from 'node:fs';

export function getABI(contractName: string) {
    try {
        // Read the file
        const contractFile = JSON.parse(
            fs.readFileSync(
                `./artifacts/contracts/${contractName}.sol/${contractName}.json`,
                'utf8'
            )
        );

        // Get the ABI from the file
        return contractFile.abi;
    } catch (error) {
        console.error(`Error: Unable to find ABI for ${contractName}`);
        console.error(error);
    }
}
