/**
 * [Clause](http://localhost:8669/doc/stoplight-ui/#/schemas/Clause)
 */
// eslint-disable-next-line sonarjs/class-name
interface ClauseJSON {
    to: string | null; // hex address
    value: string; // hex
    data: string; // hex
}

export { type ClauseJSON };
