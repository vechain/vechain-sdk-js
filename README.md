<div align="center">
  <h1><code>vechain-sdk</code></h1>
  <p>
    <strong>The official JavaScript SDK for vechain.</strong>
  </p>
  <p>
    <a href="https://github.com/vechainfoundation/vechain-sdk/actions/workflows/on-main.yml"><img src="https://github.com/vechainfoundation/vechain-sdk/actions/workflows/on-main.yml/badge.svg" alt="main-ci"></a>
    <a href="https://sonarcloud.io/summary/new_code?id=vechainfoundation_thor-sdk-js"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechainfoundation_thor-sdk-js&metric=alert_status&token=0e94ce34f24ef54d43c15c0d4b38f2c645c92b42" alt="Quality Gate Status"></a>
    <a href="https://sonarcloud.io/summary/new_code?id=vechainfoundation_thor-sdk-js"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechainfoundation_thor-sdk-js&metric=coverage&token=0e94ce34f24ef54d43c15c0d4b38f2c645c92b42" alt="Coverage"></a>
    <a href="https://github.com/vechainfoundation/vechain-sdk/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  </p>
</div>

## Introduction

🚀 Welcome to the **vechain SDK**, your passport to the dazzling universe of decentralized wonders on the vechain blockchain. Brace yourself for a coding adventure like no other! Whether you're a blockchain bard or a coding wizard, our SDK is your key to unlocking the mysteries of secure and seamless blockchain development. Join us in this epic journey, where lines of code transform into spells of innovation, and every commit propels you deeper into the enchanted realms of VechainThor. Ready to embark on a coding odyssey? Let the vechain SDK be your guide! 🌌🔮

## Repository Structure
Welcome to the Vechain SDK repository! Here's a breakdown of our organized structure:

- `./docs`: Your go-to destination for comprehensive documentation. Explore demonstrative examples showcasing the prowess of our SDK. Knowledge is power, and our docs are here to enlighten your path.
- `./packages`: A hub for our monorepo packages, each serving a distinct purpose:
   - `./packages/core`: The heart of the SDK, housing essential modules for fundamental operations like hashing and cryptography. Dive into the core for the building blocks of your decentralized dreams.
   - `./packages/network`: Embark on a journey through the network module, your gateway to all things related to blockchain interaction and transaction dissemination. Here, the vechain SDK connects you seamlessly to the VechainThor blockchain.
   - `./packages/errors`: Delve into the world of error handling with the errors package. This module is dedicated to managing and customizing errors within the SDK, ensuring your development experience remains resilient and smooth.

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
- **Test**: Execute `yarn test` to run all tests.
- **Lint**: Execute `yarn lint` to lint all packages.
- **Format**: Execute `yarn format` to format all packages.

## Integration Testing

This section provides guidance on conducting integration tests using a local thor-solo node. Ensure Docker is operational on your system before proceeding.

### Setting Up
The integration tests interact with a local thor-solo node. This node utilizes the `thor-solo/instance-a4988aba7aea69f6-v3/main.db` data directory, which is pre-configured with a block history and 20 seeded accounts for testing.

### Running Tests
1. **Start the thor-solo node**: Ensure Docker is running and execute the script to launch the thor-solo node.
2. **Run tests**: Use `yarn test:integration` to execute integration tests. These tests are designed to interact with the thor-solo node, verifying the correct operation of various SDK functionalities.

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
- The `./docs` directory houses extensive code examples written as executable demonstrations.
- Dive into the [examples](./docs/README.md) for a hands-on understanding of the SDK capabilities.
- For a comprehensive overview of the package structure, please refer to our [Architecture Diagrams](./docs/architecture-diagrams/) located in the documentation directory.

## Contributing

If you want to contribute to this project and make it better, your help is very welcome. Contributing is also a great way to learn more about social coding on Github, new technologies and and their ecosystems and how to make constructive, helpful bug reports, feature requests and the noblest of all contributions: a good, clean pull request.

For more details and guidelines on how to contribute, refer to [CONTRIBUTING](./.github/CONTRIBUTING.md).

## License

This project is licensed under the [MIT license](./.github/LICENSE.md).

## Publishing
The vechain SDK uses `Changesets CLI`. Execute the `yarn changeset version` and `yarn changeset publish` commands to release a new package.

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