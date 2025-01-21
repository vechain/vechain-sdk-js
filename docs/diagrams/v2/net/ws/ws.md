```mermaid
classDiagram
    class MozillaWebSocketClient {
        constructor(baseURL: string) MozillaWebSocketClient
    }
    class WebSocketClient {
        <<interface>>
        baseURL: string
        addMessageListener(listener: WebSocketListener~EventType~)
        close(): WebSocketClient
        open(path: HttpPath): WebSocketClient
        removeListener(listener: WebSocketListener<unknown>): WebSocketClient
    }
    class WebSocketListener~EventType~ {
        <<interface>>
        onClose(event: Event)
        onError(event: Event)
        onMessage(event: MessageEvent~EventType~)
        onOpen(event: Event)
    }
    WebSocketClient <|.. MozillaWebSocketClient
    WebSocketListener <--o WebSocketClient
```
