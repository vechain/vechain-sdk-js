# Introduction

Thank you for considering contributing to the vechain-sdk project. This SDK is an important part of the vechain ecosystem and your contributions are greatly appreciated. This document outlines the process and guidelines for contributing.

# Getting Started

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Install the dependencies by running yarn install.
4. Make your changes in a new git branch: git checkout -b my-fix-branch master.

# Coding Rules

To ensure consistency throughout the source code, please adhere to the following rules:

1. Follow the coding style used throughout the project. The project includes an ESLint configuration, so consider installing an ESLint plugin for your text editor for real-time linting.
2. All public API methods must be documented.
3. Write tests for new features and bug fixes.
4. For integration tests using thor-solo, if needed, use a `TEST_ACCOUNT` in order to isolate previous integration tests.
5. We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.

# Commenting Guidelines

## Class Commenting
Provide an overview of the class's purpose, how it should be used, and in which subsystem it belongs if applicable.
```typescript
/**
 * Represents a statistical utility that provides methods to compute 
 * common statistical metrics.
 *
 * @remarks
 * This class provides static methods and adheres to the immutability and statelessness principles. 
 * It is a part of the {@link vechain-sdk#Statistics | Statistics subsystem}.
 */
export class Statistics {
  ...
}
```

## Method Commenting
Document the purpose, parameters, return values, and usage examples of methods, as well as any exceptions they might throw.
```typescript
/**
 * Computes the average of two numbers.
 *
 * @remarks
 * This method is designed for two numbers only and returns the exact arithmetic mean.
 * It is a part of the {@link vechain-sdk#Statistics | Statistics subsystem}.
 *
 * @param x - The first input number.
 * @param y - The second input number.
 * @returns The arithmetic mean of `x` and `y`.
 *
 * @example
 * ```
 * const average = Statistics.getAverage(5, 3); 
 * console.log(average); // Outputs: 4
 * ```
 */
public static getAverage(x: number, y: number): number {
  return (x + y) / 2.0;
}
```

## Property Commenting
Explain the purpose of properties and any noteworthy characteristics about them.
```typescript
/**
 * The total count of instances created from this class.
 * 
 * @remarks
 * This property is static and reflects the total count across all instances.
 */
public static instanceCount: number = 0;
```

## Exception Commenting
Describe under what conditions methods throw exceptions.
```typescript
/**
 * Parses a string and returns its integer representation.
 * 
 * @param s - The string to parse.
 * @returns The integer representation of the string.
 * 
 * @throws {NumberFormatException}
 * Thrown when the provided string does not have a valid integer format.
 */
public static parseInteger(s: string): number {
  const result = parseInt(s, 10);
  if (isNaN(result)) {
    throw new NumberFormatException(`Invalid number format: ${s}`);
  }
  return result;
}
```

# Test Group Tagging

When adding new tests or modifying existing ones, please make use of the `@group` tag to indicate the nature of the test:

- For unit tests, use `@group unit`.
- For integration tests, use `@group int`.
```typescript
/**
 * Bloom filter tests
 *
 * @NOTE different from ../utils/bloom/bloom.test.ts.
 * This tests bloom functionality, not the utils.
 * @group unit/bloom
 */
describe('Bloom Filter', () => {
  /**
    * Test estimate K function
    */
  test('Estimate K', () => {
      bloomKTestCases.forEach((bloomKTestCase) => {
          expect(bloom.calculateK(bloomKTestCase.calculateK)).toBe(
              bloomKTestCase.estimatedK
          );
      });
  });
});
```
These tags help us categorize and run specific types of tests when needed. This ensures that our test suite remains well-organized and efficient.

# Submitting a Pull Request

Before submitting a pull request, please make sure the following is done:

1. Rebase your branch on the latest master branch.
2. Run the test suite to make sure your changes do not break existing functionality. You can do this by running yarn test.
3. Squash your commits into a single commit with a clear message.
4. Push your branch to your fork on GitHub.
5. Open a pull request against the master branch of the vechain-sdk repository.

# Pull Request Review

All submissions, including submissions by project members, require review. We use GitHub's pull request review feature for this.

# Issues

If you find a bug or want to request a new feature, please open a new issue. When filing a bug report, please provide a clear description of the problem, including the expected behavior and the actual behavior.

# Thank You

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.