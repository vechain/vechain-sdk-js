#VeChain SDK Contributing

## Introduction

Thank you for considering contributing to theVeChain SDK project.
This SDK is an important part of theVeChain ecosystem, and your contributions are greatly appreciated.
This document outlines the process and guidelines for contributing.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Install the dependencies by running yarn install.
4. Make your changes are in a new git branch: git checkout -b my-fix-branch master.

## Coding Rules

To ensure consistency throughout the source code, please adhere to the following rules:

1. Follow the coding style used throughout the project. The project includes an ESLint configuration, so consider installing an ESLint plugin for your text editor for real-time linting.
2. All public API methods must be documented.
3. Write tests for new features and bug fixes.
4. For integration tests using thor-solo, if needed, use a `TEST_ACCOUNT` in order to isolate previous integration tests.
5. Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages.

## Guidelines for Documentation Updates

Accurate and up-to-date documentation is vital for the usability and maintainability of the vechain-sdk.
We welcome contributions that improve or update the documentation.

### Textual Documentation

1. **Clarity and Accuracy**: Ensure that the documentation is clear, accurate, and easy to understand. Avoid technical jargon where possible, or provide explanations for technical terms.
2. **Consistency**: Follow the existing format and style of the documentation. This includes using the same tense, person, and voice.
3. **Markdown Formatting**: Use Markdown formatting appropriately to improve the readability of the document.

### Diagrams

1. **Updating Diagrams**: In the `docs/diagrams` directory, update diagrams if there are significant changes to the system architecture or if you find any outdated diagrams.
2. **Tools**: Use mermaid markdown diagrams that produce clear, high-quality diagrams.
3. **Documenting Changes**: Include a brief description of what was changed in the diagram and why in your pull request.

## Commenting Guidelines

### Class Commenting

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

### Method Commenting

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

### Property Commenting

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

### Exception Commenting

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
## Tests

Testing is a crucial aspect of maintaining a high-quality codebase in theVeChain SDK project. Tests not only validate the correctness of the code but also ensure that future changes do not inadvertently introduce bugs or regressions. It is imperative that all new features and bug fixes are accompanied by corresponding tests to verify their functionality. Additionally, existing code should have adequate test coverage to maintain its stability over time. We aim for 100% test coverage to guarantee the reliability of the SDK.

### Test Group Tagging

When adding new tests or modifying existing ones, please make use of the `@group` tag to indicate the nature of the test:

- For unit tests, use `@group unit`.
- For integration tests, use `@group integration`.

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

### Test File Naming Convention

When adding new test files, please adhere to the following naming conventions to maintain consistency across the project:

```typescript
/**
 * Allowed names for test files
 */
const allowedNames = [
    // Unit tests
    '.unit.test.ts',

    // Integration tests
    '.testnet.test.ts',
    '.mainnet.test.ts',
    '.solo.test.ts',

    // Mocks
    '.mock.testnet.ts',
    '.mock.mainnet.ts',
    '.mock.solo.ts'
];
```

## Error handling conventions

Errors handling is delegated to `errors` package.
Follow all code snapshots and convention related to it.

### Input validation

The typical flow to handle errors is the following:

```typescript
import { errors } from 'vechain-sdk';

function some_function(input: any) {
  assert(valid_input(input), ERROR_CODE, ERROR_MESSAGE);
}
```

### Common assertions

It is often observed that certain assertions are applicable across various contexts. 
Adhering to the principle of Don't Repeat Yourself (DRY), it is imperative that these assertions be consolidated in a universally accessible file.

## Issues

If you find a bug or want to request a new feature, please open a new issue. When filing a bug report, please provide a clear description of the problem, including the expected behavior and the actual behavior.

## Submitting a Pull Request

Before submitting a pull request, please make sure the following is done:

1. Rebase your branch on the latest main branch.
2. Run the test suite to make sure your changes do not break existing functionality. You can do this by running `yarn test`.
3. Squash your commits into a single commit with a clear message.
4. Push your branch to your fork on GitHub.
5. Open a pull request against the main branch of the vechain-sdk repository.

### Pull Request Review

All submissions, including submissions by project members, require a review. We use GitHub's pull request review feature for this.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for everyone who contributes to or interacts with theVeChain SDK project. To ensure a positive experience for our community, we have established a [Code of Conduct](CODE_OF_CONDUCT.md) that outlines our expectations for behavior. We encourage all contributors, maintainers, and users to familiarize themselves with this code, as it reflects our commitment to creating a diverse and respectful community. Thank you for helping us maintain a welcoming and collaborative space for all.

## Thank You

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.