<div align="center">
  <h1><code>vechain-sdk-js</code></h1>
  <p>
    <strong>The official JavaScript SDK for VeChain.</strong>
  </p>
  <p>
    <a href="https://github.com/vechain/vechain-sdk-js/actions/workflows/on-main.yml"><img src="https://github.com/vechain/vechain-sdk-js/actions/workflows/on-main.yml/badge.svg" alt="main-ci"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=alert_status&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Quality Gate Status"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=coverage&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Coverage"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=security_rating&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Security Rating"></a>
    <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-sdk"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-sdk&metric=sqale_rating&token=c67db88ec1549a9d15bb1bcc9bafc8ca8b1dbfcb" alt="Maintainability Rating"></a>
    <a href="https://github.com/vechain/vechain-sdk-js/blob/main/.github/LICENSE.md"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  </p>
</div>

## Introduction

🚀 Welcome to the **vechain SDK**, your passport to the dazzling universe of decentralized wonders on the VeChain blockchain. Brace yourself for a coding adventure like no other! Whether you're a blockchain bard or a coding wizard, our SDK is your key to unlocking the mysteries of secure and seamless blockchain development. Join us in this epic journey, where lines of code transform into spells of innovation, and every commit propels you deeper into the enchanted realms of VeChainThor. Ready to embark on a coding odyssey? Let the VeChain SDK be your guide! 🌌🔮

## Repository Structure

Welcome to the VeChain SDK repository! Here's a breakdown of our organized structure:

- `./apps`: Explore a suite of sample applications that demonstrate the versatility and power of our SDK in real-world scenarios. From Next.js to Node.js, HardHat, and CloudFlare, these examples serve as practical guides to kickstart your development journey.
- `./docker`: Streamline your development and deployment with our comprehensive Docker configurations. This directory offers Dockerfiles and Docker Compose setups designed to create consistent, reproducible environments.
- `./docs`: Your go-to destination for comprehensive documentation. Explore demonstrative examples showcasing the prowess of our SDK. Knowledge is power, and our docs are here to enlighten your path.
- `./packages`: A hub for our monorepo packages, each serving a distinct purpose:
   - `./packages/core`: The heart of the SDK, housing essential modules for fundamental operations like hashing and cryptography. Dive into the core for the building blocks of your decentralized dreams.
   - `./packages/errors`: Delve into the world of error handling with the error package. This module is dedicated to managing and customizing errors within the SDK, ensuring your development experience remains resilient and smooth.
   - `./packages/hardhat-plugin`: Seamlessly integrate the VeChain SDK with Hardhat, the Ethereum development environment. This plugin provides a bridge between the VeChain SDK and the Ethereum ecosystem, enabling you to leverage the best of both worlds.
   - `./packages/logging`: The logging package provides a simple and easy-to-use logging system for the VeChain SDK. This module is dedicated to managing and customizing logs within the SDK, ensuring your development experience remains transparent and insightful.
   - `./packages/network`: Embark on a journey through the network module, your gateway to all things related to blockchain interaction and transaction dissemination. Here, the VeChain SDK connects you seamlessly to the VeChainThor blockchain.
   - `./packages/rpc-proxy`: This package is designed to bridge the gap between Thor's RESTful API and Ethereum's JSON-RPC.
- `./script`: Enhance your workflow efficiency with our collection of utility scripts. Located here are tools for tasks like automated testing, pre-release preparations, and file validation.

Explore, experiment, and let the VeChain SDK empowers your blockchain adventures!

## SDK Development

### Prerequisites

> **Note** <br />
> Docker is required for setting up a local thor-solo node for integration testing.
 - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
 - [Node.js](https://nodejs.org/en): versions 18, 19, 20 (LTS), 21 (latest)
 - [Yarn](https://classic.yarnpkg.com/en/docs/install)
 - [Docker](https://docs.docker.com/get-docker/)

#### Additional prerequisites for Windows 10

[Docker Desktop](https://www.docker.com/products/docker-desktop/) needs the run on *Windows 10* patched
at the level **21H2 (19044 build)**. The last level provided by *Windows 10* automatic upgrade is **21H1 (1043 build)**.
To install *Docker Desktop* to run *Thor Solo* to develop with this SDK, and *Windows 10* is not patched with a build
higher than 19043, follows the instructions published in the 
[KB5015684 Featured Update Windows 10 to 22H2](https://support.microsoft.com/en-us/topic/kb5015684-featured-update-to-windows-10-version-22h2-by-using-an-enablement-package-09d43632-f438-47b5-985e-d6fd704eee61)
guide.
1. Update *Windows 10* to the last available level, if this is not **21H2 (19044 build)** go to step 2.
2. From **Start - Settings - Update & Security - Windows Update** panel, see if the link **View Optional Updates** is
   visible and clickable, else go to step 3.
3. From **Start - Settings - Update & Security** opt in  the **Windows Insider Program**.
4. From **Start - Settings - Update & Security - Windows Update** panel, click **View Optional Updates** and install 
   all the available patches.

#### Additional prerequisite for Windows OS

This SDK is supposed to be downloaded and installed with *Git*.
*Yarn* scripts are distributed according Linux/MacOS/Unix  shell specifications.
To let *Windows OS* to manage *Git* distributed software, to install and upgrade this SDK and run *Yarn* scripts,
please, follow the instructions below.
1. Install the official [Git for Windows](https://git-scm.com/download/win).
   The installation deploys the [Git Bash - MINGW](https://www.mingw-w64.org/) terminal in *Windows 0S*, 
   providing a terminal compatible with the *Yarn* scripts used in this SDK.
2. From **Start**menu, click **Git Bash** to open the terminal compatible with the *Yarn* scripts. You are now
3. ready to getting started.

#### Configure JetBrains IDE to use Git Bash

- Locate where Git Bash is installed.
    - From **Start** menu, select **Git**, right-click **Git Bash**, select **More - Open File Location**, select
      **Git Bash**, right-click **Properties**.
    - In the shown panel, copy the **Target** item value: it shows how to call the executable.
      By default **Target** is set `"C:\Program Files\Git\git-bash.exe" --cd-to-home`.
- [Set IDEA Terminal](https://www.jetbrains.com/help/idea/terminal-emulator.html#smart-command-execution)
    - Select **File - Settings - Tools - Terminal**, in the **Application Settings** section set **Shell path** to where
      Git Bash is installed, by default set to `C:\Program Files\Git\bin\bash.exe`.
- [Set WebStorm Terminal](https://www.jetbrains.com/help/webstorm/settings-tools-terminal.html)
    - Select **File - Settings - Tools - Terminal**, in the **Application Settings** section set **Shell path** to where
      Git Bash is installed, by default set to `C:\Program Files\Git\bin\bash.exe`.
- Opening new **Terminal** panes in the IDE will use Git Bash.

### Getting Started
1. Clone your forked repository.
2. Navigate to the project directory.
3. Run `yarn install` to install all dependencies.

### Official Documentation

Explore the full documentation and access example use cases by visiting the [VeChain SDK Documentation](https://docs.vechain.org/developer-resources/sdks-and-providers/sdk)

### Commands

- **Build**: Execute `yarn build` to build the project.
- **Test**: Execute `yarn test:solo` to run all tests.
  - **NOTE**: Integration tests require a local thor-solo node. See the [Integration Testing](#integration-testing) section for more details. 
- **Lint**: Execute `yarn lint` to lint all packages.
- **Format**: Execute `yarn format` to format all packages.

## Integration Testing

This section provides guidance on conducting integration tests using a local thor-solo node. Ensure Docker is operational on your system before proceeding.

### Setting Up

The integration tests interact with a local thor-solo node.
This node uses the `docker/thor/data/instance-a4988aba7aea69f6-v3/main.db` data directory,
which is pre-configured with a block history and 20 seeded accounts for testing.

### Running Tests

There are two ways to run tests:

1. **Manual start of thor-Solo node**:
   - To start the thor-Solo node manually, use the command `yarn start-thor-solo`.
   - Once the local thor-Solo node is running, integration tests can be executed with `yarn test`.
   - After testing is complete, stop the node with `yarn stop-thor-solo`.
   
2. **Simple execution**:
   - For a more straightforward approach, use `yarn test:solo`.
   - This command handles the thor-Solo node's start and stop processes for you.


#### Running tests in a browser-like environment

The SDK fully support execution in a browser environment. To run the tests in a browser-like environment, you can use the `yarn test:browser` command. This command requires a local thor-solo node to be running.
Alternatively, you can run the tests with thor-solo by using the `yarn test:browser:solo` command. This command will start thor-solo, run the tests, and stop thor-solo at the end.



```bash


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

On the `/docs` folder you can find the comprehensive **SDK documentation** and executable code examples.
We've designed these examples not just for learning purposes but also as integration tests,
ensuring that the provided code snippets are always functional and up to date.

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

Note: links that are to be expanded must have a text \[example]

#### Code Snippets

It's also possible to include just a code snippet from an example file. For instance:

[DeployContractSnippet](examples/contracts/contract-create-ERC20-token.ts)

Will just include into the documentation the code snippet between the comments `// START_SNIPPET: DeployContractSnippet` and `// END_SNIPPET: DeployContractSnippet` in the file `examples/contracts/contract-create-ERC20-token.ts`.

Important: The code snippets names must be unique across all examples and must end with the word "Snippet".

In this way we can keep the examples dry and avoid duplicating code.


### Usage

To build the documentation, expanding examples into code snippets, use:
``` bash
yarn build
```

### Architecture diagrams

For a comprehensive overview of the package structure, please refer to our [Architecture Diagrams](./docs/diagrams/) located in the documentation directory.

- You can also create and test your examples using `yarn test:examples` command (with solo `yarn test:examples:solo`).

## Experimental Features
We are continuously working on new features and improvements to enhance the SDK.
You can enable experimental features of specific cryptographic modules by use `useExperimentalCryptography` function of a specific module.

For example:

```typescript
keystore.useExperimentalCryptography(true)
```

## Troubleshooting

### Next.js

Projects based on [Next.js](https://nextjs.org/) need the root `tsconfig.json` file includes the options

```json
{
  "compilerOptions": {
    "target": "es2020",
    "types": [
      "@testing-library/jest-dom"
    ]
  }
}
```
to define the runtime and the test framework to be compatible with the
[ECMAScript 2020](https://262.ecma-international.org/11.0/)
language specifications.

An example of **Next.js** [tsconfig.json](apps/sdk-nextjs-integration/tsconfig.json) is available in
the module [sdk-nextjs-integration](apps/sdk-nextjs-integration).

**Next.js** caches data types when dependencies are installed and the project is built. To be sure
the options defined in `tsconfig.json` are effective when changed,
delete the directories `.next`, `node_modules` and the file `next-env.d.ts`
from the root directory of the project, then rebuild the project.

## Contributing

If you want to contribute to this project and make it better, your help is very welcome. Contributing is also a great way to learn more about social coding on GitHub, new technologies and their ecosystems and how to make constructive, helpful bug reports, feature requests and the noblest of all contributions: a good, clean pull request.

For more details and guidelines on how to contribute, refer to [CONTRIBUTING](./.github/CONTRIBUTING.md).

## License

This project is licensed under the [MIT license](./.github/LICENSE.md).

## Publishing

The VeChain SDK uses `Changesets CLI`. To publish a new release:
``` bash
yarn pre-release X.Y.Z
yarn changeset publish
```
Finally, update also the [documentation](https://github.com/vechain/vechain-docs).

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
