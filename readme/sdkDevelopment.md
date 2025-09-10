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