#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Helper function to execute commands
function execCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        const child = exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });

        // Pipe output to console in real-time
        child.stdout?.on('data', (data) => process.stdout.write(data));
        child.stderr?.on('data', (data) => process.stderr.write(data));
    });
}

// Find the solo-setup package directory
function findPackageRoot() {
    // Check if running from global installation
    const scriptDir = path.dirname(__filename);
    const packageRoot = path.dirname(scriptDir); // Go up from /bin to package root

    if (fs.existsSync(path.join(packageRoot, 'docker-compose.solo.yml'))) {
        return packageRoot;
    }

    throw new Error(
        'Could not find solo-setup package. Please ensure it is properly installed.'
    );
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log(`
VeChain Solo Setup CLI

Usage:
  solo-setup <command>

Commands:
  up               Start the Thor solo node
  down             Stop the Thor solo node
  seed             Deploy contracts and seed accounts
  status           Check if Thor solo node is running
  logs             Show Thor solo node logs
  clean            Clean up containers and volumes
  config           Show current configuration from config.json
  help             Show this help message

Examples:
  solo-setup up
  solo-setup seed
  solo-setup config
  solo-setup down
        `);
        return;
    }

    try {
        const packageRoot = findPackageRoot();
        const originalCwd = process.cwd();

        // Change to package directory for all commands
        process.chdir(packageRoot);

        switch (command) {
            case 'up':
                console.log('Starting Thor solo node...');
                await execCommand(
                    'docker compose -f ./docker-compose.solo.yml up -d'
                );
                console.log('Thor solo node started successfully!');
                console.log('Thor API available at: http://localhost:8669');
                break;

            case 'down':
                console.log('Stopping Thor solo node...');
                await execCommand(
                    'docker compose -f ./docker-compose.solo.yml down'
                );
                console.log('Thor solo node stopped successfully!');
                break;

            case 'seed':
                console.log('Building and seeding...');
                // First check if node is running
                try {
                    await execCommand(
                        'curl -s http://localhost:8669/blocks/best',
                        { timeout: 5000 }
                    );
                } catch (error) {
                    console.error(
                        'Thor solo node is not running. Please start it first with: solo-setup up'
                    );
                    process.exit(1);
                }

                // Set the original working directory as an environment variable for the deploy script
                process.env.SOLO_SETUP_ORIGINAL_CWD = originalCwd;

                // Use npx hardhat to run the deployment script properly
                await execCommand(
                    'npx hardhat run dist/deploy.js --network vechain_solo'
                );
                console.log('Seeding completed successfully!');
                break;

            case 'status':
                try {
                    const result = await execCommand(
                        'docker compose -f ./docker-compose.solo.yml ps --format json'
                    );

                    let containers;
                    try {
                        const parsed = JSON.parse(result.stdout);
                        // Handle both single container (object) and multiple containers (array)
                        containers = Array.isArray(parsed) ? parsed : [parsed];
                    } catch (e) {
                        console.log('No services are running');
                        console.log('Start them with: solo-setup up');
                        break;
                    }

                    const thorContainer = containers.find(
                        (c) =>
                            c.Service === 'thor-solo' || c.Name === 'thor-solo'
                    );

                    console.log('Service Status:');
                    console.log('');

                    // Thor solo status
                    if (thorContainer && thorContainer.State === 'running') {
                        console.log('Thor solo node is running');
                        console.log('API available at: http://localhost:8669');

                        // Try to get node info
                        try {
                            const nodeInfo = await execCommand(
                                'curl -s http://localhost:8669/blocks/best'
                            );
                            const block = JSON.parse(nodeInfo.stdout);
                            console.log(`Current block: #${block.number}`);
                        } catch (e) {
                            console.log(
                                'Node is running but API not responding'
                            );
                        }
                    } else {
                        console.log('Thor solo node is not running');
                    }

                    console.log('');

                    // Check for config file in original working directory
                    const configPath = path.join(originalCwd, 'config.json');
                    if (fs.existsSync(configPath)) {
                        console.log('Configuration file exists');
                        console.log(
                            'Use "solo-setup config" to view configuration'
                        );
                    } else {
                        console.log('Configuration file not found');
                        console.log(
                            'Run "solo-setup seed" to deploy contracts and generate configuration'
                        );
                    }

                    console.log('');

                    // Overall status
                    const thorRunning =
                        thorContainer && thorContainer.State === 'running';
                    const configExists = fs.existsSync(configPath);

                    if (thorRunning && configExists) {
                        console.log('Everything is ready!');
                    } else if (!thorRunning) {
                        console.log('Start Thor node with: solo-setup up');
                    } else if (!configExists) {
                        console.log('Deploy contracts with: solo-setup seed');
                    }
                } catch (error) {
                    console.log('No services are running');
                    console.log('Start them with: solo-setup up');
                }
                break;

            case 'logs':
                console.log(
                    'Showing Thor solo node logs (Press Ctrl+C to exit)...'
                );
                const logsProcess = spawn(
                    'docker',
                    [
                        'compose',
                        '-f',
                        './docker-compose.solo.yml',
                        'logs',
                        '-f'
                    ],
                    {
                        stdio: 'inherit'
                    }
                );

                process.on('SIGINT', () => {
                    logsProcess.kill('SIGINT');
                    process.exit(0);
                });
                break;

            case 'clean':
                console.log('Cleaning up containers and volumes...');
                await execCommand(
                    'docker compose -f ./docker-compose.solo.yml down -v'
                );
                await execCommand('docker system prune -f');
                console.log('Cleanup completed!');
                break;

            case 'config':
                try {
                    // Look for config file in original working directory
                    const configPath = path.join(originalCwd, 'config.json');
                    if (!fs.existsSync(configPath)) {
                        console.log('Configuration file not found');
                        console.log(
                            'Run "solo-setup seed" to deploy contracts and generate configuration'
                        );
                        return;
                    }

                    const configContent = fs.readFileSync(configPath, 'utf8');
                    const config = JSON.parse(configContent);

                    console.log('Current Configuration:');
                    console.log('');
                    console.log('Contracts:');
                    console.log(
                        `  TestingContract: ${config.TESTING_CONTRACT_ADDRESS}`
                    );
                    console.log(`  TestingToken: ${config.TEST_TOKEN_ADDRESS}`);
                    console.log('');
                    console.log('Transactions:');
                    console.log(
                        `  Seed VET: ${config.SEED_VET_TX_ID || 'N/A'}`
                    );
                    console.log(
                        `  Seed VTHO: ${config.SEED_VTHO_TX_ID || 'N/A'}`
                    );
                    console.log(
                        `  Seed TestToken: ${config.SEED_TEST_TOKEN_TX_ID || 'N/A'}`
                    );
                    console.log('');
                    console.log('Genesis Block:');
                    console.log(
                        `  Number: ${config.SOLO_GENESIS_BLOCK?.number || 'N/A'}`
                    );
                    console.log(
                        `  ID: ${config.SOLO_GENESIS_BLOCK?.id || 'N/A'}`
                    );
                } catch (error) {
                    console.error('Failed to read configuration file');
                    console.error(
                        'The config.json file might be corrupted. Try running "solo-setup seed" again.'
                    );
                }
                break;

            case 'help':
            case '--help':
            case '-h':
                console.log(`
VeChain Solo Setup CLI

Usage:
  solo-setup <command>

Commands:
  up               Start the Thor solo node
  down             Stop the Thor solo node
  seed             Deploy contracts and seed accounts
  status           Check if Thor solo node is running
  logs             Show Thor solo node logs
  clean            Clean up containers and volumes
  config           Show current configuration from config.json
  help             Show this help message

Examples:
  solo-setup up
  solo-setup seed
  solo-setup config
  solo-setup down
                `);
                break;

            default:
                console.error(`Unknown command: ${command}`);
                console.log('Run "solo-setup help" for available commands.');
                process.exit(1);
        }

        // Restore original working directory
        process.chdir(originalCwd);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
});
