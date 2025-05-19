/** @type {import('ts-jest').JestConfigWithTsJest} */
// Coverage threshold would apply to yarn test, not yarn test:unit
const isUnitTest = process.env.UNIT;
const { pathsToModuleNameMapper } = require('ts-jest');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require('./tsconfig');


module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ),
    coverageThreshold:
        isUnitTest !== 'true'
            ? {
                  global: {
                      branches: 0,
                      functions: 0,
                      lines: 0,
                      statements: 0
                  }
              }
            : undefined
};
