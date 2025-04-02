/**
 * Represents the query part of a URL.
 *
 * This interface provides a way to encapsulate and retrieve the query part of the URL of an HTTP request.
 */
interface HttpQuery {
    /**
     * Retrieves the query part string.
     *
     * @return {string} The query as string.
     */
    get query(): string;
}

export type { HttpQuery };
