import WebSocket from 'isomorphic-ws';

// Mock WebSocket for both Node.js and browser environments
(global as any).WebSocket = WebSocket;

// Function to create and manage WebSocket connection
async function testWebSocketConnection(url: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
        const ws = new WebSocket(url);

        ws.on('open', () => {
            console.log('WebSocket connection established.');
        });

        ws.on('message', (data) => {
            // Handle different types of data received
            let message: string;

            if (typeof data === 'string') {
                message = data; // Handle string data
            } else if (data instanceof Buffer) {
                message = data.toString('utf8'); // Handle Buffer data in Node.js
            } else if (data instanceof ArrayBuffer) {
                message = Buffer.from(data).toString('utf8'); // Handle ArrayBuffer in browsers
            } else if (data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result instanceof ArrayBuffer) {
                        message = Buffer.from(reader.result).toString('utf8'); // Handle Blob in browsers
                    } else {
                        reject(new Error('Unexpected reader result type.'));
                    }
                };
                reader.onerror = (error) => {
                    reject(error); // Handle FileReader errors
                };
                reader.readAsArrayBuffer(data);
                return; // Return early to avoid resolving promise before FileReader completes
            } else {
                reject(new Error('Unsupported message data type.'));
                return;
            }

            console.log('Received message:', message);
            resolve(true); // Resolve the promise when a message is received
            ws.close(); // Close the WebSocket connection
        });

        ws.on('error', (error) => {
            reject(error); // Reject the promise on WebSocket error
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed.');
        });
    });
}

// Example usage
const wsURL: string = 'wss://echo.websocket.org'; // Replace with your WebSocket server URL
testWebSocketConnection(wsURL)
    .then(() => {
        console.log('WebSocket test successful.');
    })
    .catch((error) => {
        console.error('WebSocket test failed:', error);
    });
