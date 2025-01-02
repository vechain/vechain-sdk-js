interface WebSocketListener<EventType> {
    onClose: (event: Event) => void;
    onError: (event: Event) => void;
    onMessage: (event: MessageEvent<EventType>) => void;
    onOpen: (event: Event) => void;
}

export type { WebSocketListener };
