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


