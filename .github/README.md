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

## Repository Structure
- `./demos`: Demonstrative projects
- `./packages`: Monorepo packages
   - `./packages/core`: Core module encompassing all fundamental SDK operations such as hashing and cryptography.
   - `./packages/network`: Network module facilitating all network-related SDK operations including transaction dissemination and blockchain interaction.

## SDK Development

### Prerequisites
> **Note** <br />
> Docker is required for setting up a local thor-solo node for integration testing.
 - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
 - [Node.js](https://nodejs.org/en)
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

### Integration Testing
Ensure Docker is running on your machine. The integration tests are performed against a local thor-solo node.

## Documentation and Examples
- The `./docs` directory houses extensive code examples written as executable demonstrations.
- Dive into the [examples](../docs/README.md) for a hands-on understanding of the SDK capabilities.

## Contributing

If you want to contribute to this project and make it better, your help is very welcome. Contributing is also a great way to learn more about social coding on Github, new technologies and and their ecosystems and how to make constructive, helpful bug reports, feature requests and the noblest of all contributions: a good, clean pull request.

For more details and guidelines on how to contribute, refer to [CONTRIBUTING](CONTRIBUTING.md).

## License

This project is licensed under the [MIT license](LICENSE.md).

## Publishing
... To Be Detailed ...     

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