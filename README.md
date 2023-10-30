# vechain-sdk
The official JavaScript SDK for vechain.

[![main-ci](https://github.com/vechainfoundation/vechain-sdk/actions/workflows/on-main.yml/badge.svg)](https://github.com/vechainfoundation/vechain-sdk/actions/workflows/on-main.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vechainfoundation_thor-sdk-js&metric=alert_status&token=0e94ce34f24ef54d43c15c0d4b38f2c645c92b42)](https://sonarcloud.io/summary/new_code?id=vechainfoundation_thor-sdk-js)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=vechainfoundation_thor-sdk-js&metric=coverage&token=0e94ce34f24ef54d43c15c0d4b38f2c645c92b42)](https://sonarcloud.io/summary/new_code?id=vechainfoundation_thor-sdk-js)

## Repository Structure
- `./demos`: Demonstrative projects
- `./packages`: Monorepo packages
   - `./packages/core`: Core module encompassing all fundamental SDK operations such as hashing and cryptography.
   - `./packages/network`: Network module facilitating all network-related SDK operations including transaction dissemination and blockchain interaction.

## SDK Development

### Prerequisites
- Fork the repository to your GitHub account.
- Ensure [Yarn](https://classic.yarnpkg.com/en/docs/install) is installed on your machine.
- [Docker](https://docs.docker.com/get-docker/) is required for setting up a local thor-solo node for integration testing.

### Getting Started
1. Clone your forked repository.
2. Navigate to the project directory.
3. Run `yarn install` to install all dependencies.

### Commands
- **Build**: Execute `yarn build` to build the project.
- **Test**: Execute `yarn test` to run all tests.
- **Lint**: Execute `yarn lint` to lint all packages.

### Integration Testing
Ensure Docker is running on your machine. The integration tests are performed against a local thor-solo node.

## Documentation and Examples
- The `./docs` directory houses extensive code examples written as executable demonstrations.
- Dive into the [examples](./docs/README.md) for a hands-on understanding of the SDK capabilities.


## Contributing

We appreciate your contributions and suggestions to improve the VeChain SDK. Whether it's a bug report, new feature, correction, or additional documentation, we greatly value your feedback. To get started with contributing, please review our [Contributing Guidelines](CONTRIBUTING.md).


## Publishing
... To Be Detailed ...

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