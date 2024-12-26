```mermaid
classDiagram
    class MozillaWebSocketClient {
        constructor(baseURL: string)
    }
    class WebSocketClient {
        <<interface>>
        baseURL: string
        addMessageListener(listener: WebSocketListener)
        close(): WebSocketClient
        open(path: HttpPath): WebSocketClient
    }
    class WebSocketListener~EventType~ {
        <<interface>>
        onMessage(event: MessageEvent~EventType~)
    }
    WebSocketClient <|.. MozillaWebSocketClient
    WebSocketListener <--o WebSocketClient
```
