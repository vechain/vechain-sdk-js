interface WebSocketClient {
    open: (url: string) => WebSocketClient;

    close: () => WebSocketClient;
}

export { type WebSocketClient };

/*

WebSocketListener {
  onMessage
}

 BlockSubscription{
 PATH
 open()
 addListener()
 removeListener()
 close()
 }


 */
