import { InvalidThorestResponseError } from '@common/errors';

type Constructor<ResponseType, JsonType> = new (json: JsonType) => ResponseType;

/**
 * Parse the response from the HTTP client and return the response type.
 * @param fqp - The full-qualified path of the callingfunction.
 * @param response - The response from the HTTP client.
 * @param constructor - The constructor of the response type.
 * @returns The response type.
 * @throws InvalidThorestResponse if the response cannot be parsed.
 */
async function parseResponseHandler<ResponseType, JsonType>(
    fqp: string,
    response: Response,
    constructor: Constructor<ResponseType, JsonType>
): Promise<ResponseType> {
    let json: JsonType;
    // try to parse json from response
    try {
        json = (await response.json()) as JsonType;
    } catch (parseErr) {
        const body = await response.text().catch(() => undefined);
        throw new InvalidThorestResponseError(
            fqp,
            parseErr instanceof Error ? parseErr.message : 'Bad response.',
            {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                body
            },
            parseErr instanceof Error ? parseErr : undefined
        );
    }
    // try to convert json to response type
    try {
        return new constructor(json);
    } catch (error) {
        throw new InvalidThorestResponseError(
            fqp,
            error instanceof Error ? error.message : 'Bad response.',
            {
                url: response.url,
                status: response.status,
                statusText: response.statusText,
                body: json
            },
            error instanceof Error ? error : undefined
        );
    }
}

export { parseResponseHandler };
