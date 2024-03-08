<div align="center">
  <h1><code>vechain-sdk</code></h1>
  <p>
    <strong>The official JavaScript SDK for vechain.</strong>
  </p>
  <p>
    <a href="https://github.com/vechain/vechain-sdk/actions/workflows/on-main.yml"><img src="https://github.com/vechain/vechain-sdk/actions/workflows/on-main.yml/badge.svg" alt="main-ci"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=alert_status&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Quality Gate Status"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=coverage&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Coverage"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=security_rating&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Security Rating"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=sqale_rating&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Maintainability Rating"></a>
    <a href="https://github.com/vechain/vechain-sdk/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  </p>
</div>

## Introduction

🚀 Welcome to the **vechain SDK**, your passport to the dazzling universe of decentralized wonders on the vechain blockchain. Brace yourself for a coding adventure like no other! Whether you're a blockchain bard or a coding wizard, our SDK is your key to unlocking the mysteries of secure and seamless blockchain development. Join us in this epic journey, where lines of code transform into spells of innovation, and every commit propels you deeper into the enchanted realms of VechainThor. Ready to embark on a coding odyssey? Let the vechain SDK be your guide! 🌌🔮

## Repository Structure

Welcome to the vechain SDK repository! Here's a breakdown of our organized structure:

- `./docs`: Your go-to destination for comprehensive documentation. Explore demonstrative examples showcasing the prowess of our SDK. Knowledge is power, and our docs are here to enlighten your path.
- `./packages`: A hub for our monorepo packages, each serving a distinct purpose:
   - `./packages/core`: The heart of the SDK, housing essential modules for fundamental operations like hashing and cryptography. Dive into the core for the building blocks of your decentralized dreams.
   - `./packages/errors`: Delve into the world of error handling with the errors package. This module is dedicated to managing and customizing errors within the SDK, ensuring your development experience remains resilient and smooth.
   - `./packages/hardhat-plugin`: Seamlessly integrate the vechain SDK with Hardhat, the Ethereum development environment. This plugin provides a bridge between the vechain SDK and the Ethereum ecosystem, enabling you to leverage the best of both worlds.
   - `./packages/logging`: The logging package provides a simple and easy-to-use logging system for the vechain SDK. This module is dedicated to managing and customizing logs within the SDK, ensuring your development experience remains transparent and insightful.
   - `./packages/network`: Embark on a journey through the network module, your gateway to all things related to blockchain interaction and transaction dissemination. Here, the vechain SDK connects you seamlessly to the VechainThor blockchain.
   - `./packages/provider`: Get the maximum of EVM development stack with provider package. This module is dedicated to managing the compatibility with ethers and EVM world.
   - `./packages/wallet`: Secure your assets and manage transactions with ease using the wallet package. This module provides functionality for creating and managing vechain wallets, as well as signing and broadcasting transactions securely on the VechainThor blockchain.
   - `./packages/rpc-proxy`: This package is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC.

Explore, experiment, and let the vechain SDK empower your blockchain adventures!

## SDK Development

### Prerequisites

> **Note** <br />
> Docker is required for setting up a local thor-solo node for integration testing.
 - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
 - [Node.js](https://nodejs.org/en): versions 18, 19, 20 (LTS), 21 (latest)
 - [Yarn](https://classic.yarnpkg.com/en/docs/install)
 - [Docker](https://docs.docker.com/get-docker/)

### Getting Started
1. Clone your forked repository.
2. Navigate to the project directory.
3. Run `yarn install` to install all dependencies.

### Commands

- **Build**: Execute `yarn build` to build the project.
- **Test**: Execute `yarn test:solo` to run all tests.
  - **NOTE**: Integration tests require a local thor-solo node. See the [Integration Testing](#integration-testing) section for more details. 
- **Lint**: Execute `yarn lint` to lint all packages.
- **Format**: Execute `yarn format` to format all packages.

## Integration Testing

This section provides guidance on conducting integration tests using a local thor-solo node. Ensure Docker is operational on your system before proceeding.

### Setting Up

The integration tests interact with a local thor-solo node. This node utilizes the `thor-solo/instance-a4988aba7aea69f6-v3/main.db` data directory, which is pre-configured with a block history and 20 seeded accounts for testing.

### Running Tests

There are two ways to run tests:

1. **Manual start of thor-Solo node**:
   - To start the thor-Solo node manually, use the command `yarn start-thor-solo`.
   - Once the local thor-Solo node is running, integration tests can be executed with `yarn test`.
   - After testing is complete, stop the node with `yarn stop-thor-solo`.
   
2. **Simple execution**:
   - For a more straightforward approach, use `yarn test:solo`.
   - This command handles the thor-Solo node's start and stop processes for you.

### Custom thor-solo Data Starting Point

For advanced testing scenarios, you may require a custom data starting point with thor-solo. This involves creating a custom snapshot of thor's LevelDB.

#### Creating a Custom LevelDB Snapshot

1. **Start thor-solo with Persistence**:
   - Launch thor-solo using Docker with the `--persist` flag. This enables data persistence.
   - Use the `--data-dir` flag to specify the directory where thor-solo will store its data.

2. **Perform Transactions**:
   - Execute the necessary transactions or operations in thor-solo. These transactions will be recorded in the specified data directory.
   - An example of transactions performed to seed the 20 accounts is found in the `thor-solo-seeding.ts` file

3. **Export LevelDB**:
   - Once you've completed the transactions, use a tool like `docker cp` to export the LevelDB directory (i.e., `instance-a4988aba7aea69f6-v3`) from the Docker container.

#### Using the Custom Snapshot

1. **Prepare the Dockerfile**:
   - Modify the Dockerfile used for building the thor-solo container. Ensure it copies the exported LevelDB snapshot into the correct path within the container.

2. **Update Data Directory Path**:
   - Adjust the `--data-dir` flag in your thor-solo startup script or Docker command to point to the new LevelDB snapshot location within the container.

3. **Restart thor-solo**:
   - Rebuild and restart the thor-solo container with the updated Dockerfile. This will launch thor-solo with your custom data starting point.

## Documentation and Examples

On the `/docs` folder you cna find the comprehensive **SDK documentation** and executable code examples. We've designed these examples not just for learning purposes but also as integration tests, ensuring that the provided code snippets are always functional and up-to-date.

### Examples

Our code examples reside in the `./docs/examples` folder. Each example is a stand-alone script that showcases various operations achievable with the SDK. Some of the code examples require a Thor Solo node to be available.

To run the scripts within `./docs/examples` as tests, use:
``` bash
yarn test:examples
```

**NOTE**: Tests require thor-solo to be running locally. You can run and stop separately thor solo node with `yarn start-thor-solo` and `yarn stop-thor-solo` or run all tests with `yarn test:examples:solo` which will start thor solo node, run all tests and stop thor solo at the end.

### Templates

In the `./docs/templates` folder, you'll find markdown files used to build our final documentation. These templates can include links to example files, dynamically expanded into code snippets during documentation generation.

For instance:

\[example](examples/accounts/bip39.ts)

The above link, when processed during documentation build, expands into the content of the linked file, ensuring our documentation is as practical as possible.

Note: links that are to be expanded must have text \[example]

### Usage

To build the documentation, expanding examples into code snippets, use:
``` bash
yarn build
```

### Architecture diagrams

For a comprehensive overview of the package structure, please refer to our [Architecture Diagrams](./docs/diagrams/) located in the documentation directory.


- You can also create and test your examples using `yarn test:examples` command (with solo `yarn test:examples:solo`).

## Contributing

If you want to contribute to this project and make it better, your help is very welcome. Contributing is also a great way to learn more about social coding on GitHub, new technologies and their ecosystems and how to make constructive, helpful bug reports, feature requests and the noblest of all contributions: a good, clean pull request.

For more details and guidelines on how to contribute, refer to [CONTRIBUTING](./.github/CONTRIBUTING.md).

## License

This project is licensed under the [MIT license](./.github/LICENSE.md).

## Publishing

The vechain SDK uses `Changesets CLI`. To publish a new release:
``` bash
yarn prepare-packages X.Y.Z
yarn changeset publish
```

## Contact information

- Discord https://discord.com/invite/vechain
- Support https://support.vechain.org

                              @@@@@@@@@@@@@@                     /@@@@@                   
                               @@@@@@@@@@@@@@@@                 @@@@@@                    
                                @@@@@@     @@@@@               @@@@@                      
                                  @@@@@     @@@@@             @@@@@                       
                                   @@@@@     @@@@@&          @@@@@                        
                                    @@@@@     @@@@@@       %@@@@@                         
                                     @@@@@      @@@@@     @@@@@%                          
                                      @@@@@@     @@@@@   @@@@@                            
                                        @@@@@     @@@   @@@@@                             
                                         @@@@@     @   @@@@@                              
                                          @@@@@      @@@@@@                               
                                           @@@@@    @@@@@#                                
                                            @@@@@@ @@@@@                                  
                                              @@@@@@@@@                                   
                                               @@@@@@@                       