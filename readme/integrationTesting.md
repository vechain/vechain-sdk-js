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