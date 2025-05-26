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
                      branches: 20,
                      functions: 20,
                      lines: 20,
                      statements: 20
                  }
              }
            : undefined
};
