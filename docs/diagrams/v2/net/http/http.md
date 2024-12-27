```mermaid
classDiagram
    class FetchHttpClient {
        baseURL: string
        onRequest: OnRequest
        onResponse: OnResponse
        at(baseURL: string, onRequest: OnRequest, onResponse: OnResponse) FetchHttpClient
    }
    class HttpClient {
        <<interface>>
        get(httpPath: HttpPath) Promise~Response~
        post(httpPath: HttpPath, body?: unknown) Promise~Response~
    }
    class HttpPath {
        <<interface>>
        path: string
    }
    class OnRequest {
        <<callback>>
        onRequest(request: Request) Request
    }
    class OnResponse{
        <<callback>>
        onResponse(response: Response) Response
    }
    HttpPath <-- "get - post" HttpClient
    HttpClient <|.. FetchHttpClient
    FetchHttpClient *--> OnRequest
    FetchHttpClient *--> OnResponse
```
