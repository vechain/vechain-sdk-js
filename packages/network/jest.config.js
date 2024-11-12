/** @type {import('ts-jest').JestConfigWithTsJest} */
// Coverage threshold would apply to yarn test, not yarn test:unit
const isUnitTest = process.env.UNIT;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true,
    coverageThreshold:
        isUnitTest !== 'true'
            ? {
                  global: {
                      branches: 98,
                      functions: 99,
                      lines: 99,
                      statements: 99
                  }
              }
            : undefined
};
