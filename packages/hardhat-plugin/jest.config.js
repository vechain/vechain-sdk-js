/** @type {import('ts-jest').JestConfigWithTsJest} */
const isUnitTest = process.env.UNIT;

console.log('LLEGA isUnitTest', isUnitTest, typeof isUnitTest);

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: false,
    coverageThreshold:
        isUnitTest !== 'true'
            ? {
                  global: {
                      branches: 100,
                      functions: 100,
                      lines: 100,
                      statements: 100
                  }
              }
            : undefined
};
