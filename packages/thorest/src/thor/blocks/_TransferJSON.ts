/**
 * [Transfer](http://localhost:8669/doc/stoplight-ui/#/schemas/Transfer)
 */
interface _TransferJSON {
    sender: string; // hex address
    recipient: string; // hex address
    amount: string; // hex ^0x[0-9a-f]*$
}

export { type _TransferJSON };
