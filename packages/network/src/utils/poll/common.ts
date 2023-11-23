/**
 * Sleep for a given amount of time (in milliseconds).
 *
 * @param delay - The amount of time to sleep in milliseconds.
 */
async function sleep(delayInMilliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
}

export { sleep };
