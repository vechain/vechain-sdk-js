# Jest Test Groups

## Test Groups

Tests are grouped using the following names:

| Name | Description |
|------|-------------|
| unit | Unit & mocked tests with no dependency on thor/solo |
| solo | Tests that interact with the seeded solo instance |
| testnet | Tests that interact with thor testnet |
| mainnet | Tests that interact with thor mainnet |
| devnet | Specific tests for any temporary hardfork changes |
| quarantine | Tests that are WIP, flakey, or need fixing |

NOTE:

* `devnet` group is short lived, once a hardfork is release to testnet, any corresponding tests group should be updated.
* `quarantine` group is excluded from all test commands

## Test Scopes

Tests should be NodeJS and Browser compatible. Browser tests are executed in a simulated browser environment created via `jest.config.browser.js`

## Fine-Grained Test Commands

The following commands can be executed using `corepack yarn`

| Command | Jest @group | Jest Config | Solo Setup |
|---------|-------------|-------------|------------|
| `test:node:unit` | unit | node | no |
| `test:node:solo` | solo | node | no |
| `test:browser:unit` | unit | browser | no |
| `test:browser:solo` | solo | browser | no |
| `test:node:testnet` | testnet | node | no |
| `test:node:mainnet` | mainnet | node | no |
| `test:browser:testnet` | testnet | browser | no |
| `test:browser:mainnet` | mainnet | browser | no | 
| `test:node:unit:e2e` | unit | node | yes |
| `test:node:solo:e2e` | solo | node | yes |
| `test:node:testnet:e2e` | testnet | node | yes |
| `test:node:mainnet:e2e` | mainnet | node | yes |
| `test:browser:testnet:e2e` | testnet | browser | yes |
| `test:browser:mainnet:e2e` | testnet | browser | yes |
| `test:browser:unit:e2e` | unit | browser | yes |
| `test:browser:solo:e2e` | solo | browser | yes |

The `e2e` part of the command indicates that the command does:
* downloads thor solo image
* starts thor solo
* seeds solo with test data
* executed the corresponding command without `e2e`
* stops thor solo

## Overall Test Commands

The following uber test commands can be executed using `corepack yarn`

| Command | Jest @group | Jest Config | Solo Setup |
|---------|-------------|-------------|------------|
| `test:node` | all groups | node | no |
| `test:browser` | all groups | browser | no |
| `test:node:e2e` | all groups | node | yes |
| `test:browser:e2e` | all groups | browser | yes |

## Jest Coverage Rules

Jest test coverage is only enforced when the Overall commands are used, when the Fine-Grained commands are used no code coverage is enforced. This enforcement is done via setting environment variable `ENFORCE_COVERAGE` with the code coverage settings being part of `jest.config.ts`

## Quarantine

Tests can be marked as with group `quarantine` if they should be excluded from the above test commands. This is useful if:

* Tests are a WIP
* Tests are flakey and are causing CI issues
* Tests need reworking

The objective is that the `quarantine` group is short lived, periodically reviewed and tests are moved out of quarantine when they are stable enough to be included.





