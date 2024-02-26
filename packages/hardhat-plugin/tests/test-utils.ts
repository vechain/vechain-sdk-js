import path from 'path';

/**
 * Set hardhat context function.
 *
 * This function is used to set the hardhat context for the tests.
 * Basically, every test will be an isolated hardhat environment (a hardhat project).
 *
 * @param hardhatProjectName - The name of the hardhat project to set the context
 */
const setHardhatContext = (hardhatProjectName: string): void => {
    // Init node environment directory
    process.chdir(
        path.join(__dirname, 'hardhat-mock-projects', hardhatProjectName)
    );
};

export { setHardhatContext };
