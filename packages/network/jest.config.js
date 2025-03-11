/** @type {import('ts-jest').JestConfigWithTsJest} */
// Coverage threshold would apply to yarn test, not yarn test:unit
const applyCodeCoverageLimits = process.env.APPLYCODECOVLIMITS;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageReporters: ['html', 'lcov', 'json'],
    runner: 'groups',
    reporters: ['default', 'jest-junit'],
    workerThreads: true,
    coverageThreshold:
        applyCodeCoverageLimits == 'true'
            ? {
                  global: {
                      branches: 90,
                      functions: 90,
                      lines: 90,
                      statements: 90
                  }
              }
            : undefined
};
