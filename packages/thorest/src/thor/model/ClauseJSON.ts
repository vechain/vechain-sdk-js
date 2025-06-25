/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */
interface ClauseJSON {
    to: string | null; // hex address
    value: string; // hex
    data: string; // hex
}

export { type ClauseJSON };
