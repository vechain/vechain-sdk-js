# thor-sdk-js
The official JavaScript SDK for vechain.

[![main-ci](https://github.com/vechainfoundation/thor-sdk-js/actions/workflows/on-main.yml/badge.svg)](https://github.com/vechainfoundation/thor-sdk-js/actions/workflows/on-main.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vechainfoundation_thor-sdk-js&metric=alert_status&token=0e94ce34f24ef54d43c15c0d4b38f2c645c92b42)](https://sonarcloud.io/summary/new_code?id=vechainfoundation_thor-sdk-js)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=vechainfoundation_thor-sdk-js&metric=coverage&token=0e94ce34f24ef54d43c15c0d4b38f2c645c92b42)](https://sonarcloud.io/summary/new_code?id=vechainfoundation_thor-sdk-js)

# Repo structure
* `./demos` Demo projects
* `./packages` Packages of monorepo
   * `./packages/core` Core module. It contains all core SDK operations (Hash, cryptography, ...)
   * `./packages/network` Network module. It contains all network SDK operations (Transaction spread, Blockchain interaztion, ...)  

# SDK Development
This section explains how to work with SDK.

## Installation
After forking the repository, first install all dependencies with `yarn` command.

This command will install all dependencies and you will be ready to [build](#build), [test](#test), [lint](#lint) and [publish](#publish)

## Build
This project uses yarn and turporepo. You can build project with `yarn build` command.

## Test
To perform all tests use `yarn test` command.

## Lint
To lint all packages use `yarn lint` command.

## Publish
... TBD ...

# Demo examples
This section explains how to use demo examples, to understand well the SDK.

Demo examples are Javascript and Typescript projects that execute some demo snapshots of SDK packages.

## ... TBD ...