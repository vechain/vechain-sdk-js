/**
 * [Event](http://localhost:8669/doc/stoplight-ui/#/schemas/Event)
 */
interface EventJSON {
    address: string; // hex address
    topics: string[]; // array[string] ^0x[0-9a-f]{64}$
    data: string; // hex ^0x[0-9a-f]*$
}

export { type EventJSON };
