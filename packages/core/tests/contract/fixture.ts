// Specify the path to your Solidity contract file
import path from 'path';
import fs from 'fs';

export const getContractSourceCode = (
    dirname: string,
    filename: string
): string => {
    const contractPath = path.resolve(dirname, filename);

    // Read the Solidity source code from the file
    return fs.readFileSync(contractPath, 'utf8');
};
