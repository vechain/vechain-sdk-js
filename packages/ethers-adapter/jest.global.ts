import {
    DockerComposeEnvironment,
    type StartedDockerComposeEnvironment,
    Wait
} from 'testcontainers';

/** Instance of the started Docker Compose environment. */
let dockerEnvironment: StartedDockerComposeEnvironment;

/** Path to the directory containing the Docker Compose file. */
const DOCKER_COMPOSE_FILE_PATH = '../../';

/** Name of the Docker Compose file. */
const DOCKER_COMPOSE_FILE_NAME = 'docker-compose.yaml';

/** Name of the service within the Docker Compose file. */
const THOR_SOLO_SERVICE_NAME = 'thor-solo';

/**
 * Set up the Docker Compose environment if the `JEST_INTEGRATION` environment variable is set to 'true'.
 */
export const setup = async (): Promise<void> => {
    if (process.env.JEST_INTEGRATION !== 'true') return;

    console.log('Starting thor-solo node...');

    dockerEnvironment = await new DockerComposeEnvironment(
        DOCKER_COMPOSE_FILE_PATH,
        DOCKER_COMPOSE_FILE_NAME
    )
        .withStartupTimeout(60_000)
        .withWaitStrategy(THOR_SOLO_SERVICE_NAME, Wait.forHealthCheck())
        .up();

    console.log('thor-solo node started');
};

/**
 * Tear down the Docker Compose environment if the `JEST_INTEGRATION` environment variable is set to 'true'.
 * If `dockerEnvironment` is defined, stops the Docker Compose environment, otherwise logs that it won't be stopped.
 */
export const teardown = async (): Promise<void> => {
    if (process.env.JEST_INTEGRATION !== 'true') return;

    try {
        if (dockerEnvironment !== undefined) {
            console.log('\nStopping thor-solo node...');
            await dockerEnvironment.down();
            console.log('thor-solo node stopped');
        } else {
            console.log(
                'Not stopping thor-solo node because it was not started'
            );
        }
    } catch (e) {
        console.error(e);
    }
};
