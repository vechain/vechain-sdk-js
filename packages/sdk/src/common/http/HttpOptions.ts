interface HttpOptions {
    onRequest?: (request: Request) => Request;
    onResponse?: (response: Response) => Response;
    timeout?: number;
    headers?: Record<string, string>;
    storeCookies?: boolean;
    retrySocketError?: boolean;
    retrySockerErrorCount?: number;
}

export { type HttpOptions };
