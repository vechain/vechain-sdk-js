/** @type {import('ts-jest').JestConfigWithTsJest} */
// Coverage threshold would apply to yarn test, not yarn test:unit
const isUnitTest = process.env.UNIT;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    workerThreads: true,
    coverageThreshold:
        isUnitTest !== 'true'
            ? {
                  global: {
                      branches: 100,
                      functions: 100,
                      lines: 99,
                      statements: 99
                  }
              }
            : undefined
};
