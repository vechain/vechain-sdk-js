interface WebSocketListener<EventType> {
    onMessage: (event: MessageEvent<EventType>) => void;
}

export type { WebSocketListener };
