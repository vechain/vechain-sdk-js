import { InvalidThorestResponseError } from '@common/errors';

type Constructor<ResponseType, JsonType> = new (json: JsonType) => ResponseType;

// constant for the null response body from thorest api
const NULL_RESPONSE_BODY = 'null';

// overload for the case where the response is nullable
async function parseResponseHandler<ResponseType, JsonType>(
    fqp: string,
    response: Response,
    constructor: Constructor<ResponseType, JsonType>
): Promise<ResponseType | null>;

// overload for the case where the response is not nullable
async function parseResponseHandler<ResponseType, JsonType>(
    fqp: string,
    response: Response,
    constructor: Constructor<ResponseType, JsonType>,
    isNullable: false
): Promise<ResponseType>;

/**
 * Parse the response from the HTTP client and return the response type.
 * @param fqp - The full-qualified path of the callingfunction.
 * @param response - The response from the HTTP client.
 * @param constructor - The constructor of the response type.
 * @param _isNullable - Whether the response is nullable - default is true.
 * @returns The response type or null if the response is nullable.
 * @throws InvalidThorestResponse if the response cannot be parsed.
 */
async function parseResponseHandler<ResponseType, JsonType>(
    fqp: string,
    response: Response,
    constructor: Constructor<ResponseType, JsonType>,
    _isNullable: boolean = true
): Promise<ResponseType | null> {
    let json: JsonType;
    // try to parse json from response
    try {
        json = (await response.json()) as JsonType;
    } catch (parseErr) {
        const body = await response.text().catch(() => undefined);
        // if the response body is undefined, throw an error
        if (body === undefined) {
            throw new InvalidThorestResponseError(
                fqp,
                'Empty response body.',
                {
                    url: response.url,
                    status: response.status,
                    statusText: response.statusText
                },
                undefined
            );
        }
        // if the response body is null, return null
        if (body.trim().toLowerCase() === NULL_RESPONSE_BODY) {
            if (!_isNullable) {
                throw new InvalidThorestResponseError(
                    fqp,
                    'Unexpected null response body.',
                    {
                        url: response.url,
                        status: response.status,
                        statusText: response.statusText
                    },
                    undefined
                );
            }
            return null;
        }
        // if the response body is not null, must be a json parse error
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
    // if the json is null, return null
    if (json === null) {
        if (!_isNullable) {
            throw new InvalidThorestResponseError(
                fqp,
                'Unexpected null response body.',
                {
                    url: response.url,
                    status: response.status,
                    statusText: response.statusText
                },
                undefined
            );
        }
        return null;
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
