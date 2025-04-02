/**
 * Represents the apth part of a URL.
 *
 * This interface provides a way to encapsulate and retrieve the path part of the URL of an HTTP request.
 */
interface HttpPath {
    /**
     * Retrieves the path part string.
     *
     * @return {string} The path as a string.
     */
    get path(): string;
}

export type { HttpPath };
