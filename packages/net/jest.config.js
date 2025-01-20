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
                      branches: 0,
                      functions: 0,
                      lines: 0,
                      statements: 0
                  }
              }
            : undefined
};
