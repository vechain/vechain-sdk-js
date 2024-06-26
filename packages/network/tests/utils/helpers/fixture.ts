import { type AxiosError, AxiosHeaders } from 'axios';

/**
 * Azios headers fixture
 */
const headers = new AxiosHeaders();

/**
 * Simple config fixture
 */
const config = {
    url: 'http://localhost:3000',
    headers
};

/**
 * Convert errors
 */
const convertErrors: Array<{
    customAxiosError: AxiosError<unknown, unknown>;

    testName: string;
}> = [
    {
        customAxiosError: {
            response: {
                status: 200,
                data: { foo: 'bar' },
                statusText: 'ok',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 200'
        },

        testName:
            'Should convert AxiosError with response data to Error with data'
    },
    {
        customAxiosError: {
            response: {
                status: 200,
                data: { foo: 'bar' },
                statusText: 'ok',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 200'
        },

        testName:
            'Should convert AxiosError with response data to Error with data'
    },
    {
        customAxiosError: {
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 404'
        },
        testName:
            'Should convert AxiosError without response data to Error with a basic message'
    },
    {
        customAxiosError: {
            response: {
                status: 200,
                data: 'Not found',
                statusText: 'Not Found',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with no status code'
        },
        testName: 'Should convert AxiosError to Error with a basic message'
    },
    {
        customAxiosError: {
            response: {
                status: 404,
                data: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(
                    20
                ),
                statusText: 'Not Found',
                headers,
                config
            },
            config,
            isAxiosError: true,
            toJSON: () => ({}),
            name: 'AxiosError',
            message: 'AxiosError: Request failed with status code 404'
        },
        testName: 'Should convert AxiosError with a long response data message'
    }
];

export { convertErrors };
