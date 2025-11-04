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

## Features

- Abstractions over the Thor, Thorest Rest API
- First class APIs for interacting with smart contracts
- Use of BigInt rather than BigNumber libraries
- Infer typescript types from ABIs
- Thor-Client for interacting with Thor
- Viem style PublicClient and WalletClient for Viem style useage


## Installation

```bash
npm install @vechain/sdk
```

### Examples

Code examples reside in the `./docs/examples` folder. Each example is a stand-alone script that showcases various operations achievable with the SDK. Some of the code examples require a Thor Solo node to be available.

To run the scripts within `./docs/examples` as tests, use:
``` bash
yarn test:examples
```

## Contributing

If you want to contribute to this project please read the [Contributing guide](./.github/CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the [MIT license](./.github/LICENSE.md).

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
