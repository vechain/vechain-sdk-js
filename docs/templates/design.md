# Design
High level design of the project.

## Architecture

Following chapter will give an overview of the architecture of the vechain-sdk.
Basically the vechain-sdk is divided into three packages.

* Network Package
* Core Package
* Error Package

Each of these packages has its own responsibility and is described in the following chapters.

### Network Package
The network package is the network interaction responsible package of the vechain-sdk.
It is responsible for all interactions with the blockchain.

The network package has the following [architecture](./diagrams/architecture/network-package.md).

### Core Package
The core package is the core functionality responsible package of the vechain-sdk.
It is responsible for all core functionality of the vechain-sdk.

The core package has the following [architecture](./diagrams/architecture/core-package.md).

### Error Package
The error package is the error handling responsible package of the vechain-sdk.
It is responsible for all error handling of the vechain-sdk.

The error package has the following [architecture](./diagrams/architecture/errors-package.md).
