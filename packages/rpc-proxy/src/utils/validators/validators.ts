/**
 * Check if the url is valid function
 * @param url - URL to check
 * @returns True if the url is valid, false otherwise
 */
function isValidUrl(url: string): boolean {
    try {
        // eslint-disable-next-line no-new
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if the port is valid
 * Configuration file or arguments are provided
 * @param port - Port to check
 * @returns True if the port is valid, false otherwise
 */
function isValidPort(port: number): boolean {
    return !isNaN(port) && Number.isInteger(port) && port >= 0;
}

export { isValidUrl, isValidPort };
