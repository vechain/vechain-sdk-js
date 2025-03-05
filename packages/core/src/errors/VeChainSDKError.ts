class VeChainSDKError extends Error {
    static override readonly name = 'VeChainSDKError';

    readonly args?: Record<string, unknown>;

    /**
     * Full Qualified Name of the element throwing the error.
     */
    readonly fqn: string;

    /**
     * Software Artifact Tag: name and version.
     */
    readonly tag: string;

    constructor(
        fqn: string,
        message: string,
        args?: Record<string, unknown>,
        cause?: Error,
        tag: string = 'vechain-sdk-js:2.0'
    ) {
        super(message, cause);
        this.args = args;
        this.fqn = fqn;
        this.tag = tag;
    }

    toString(
        joiner: string = ', ',
        stringify: (obj: unknown) => string = (obj: unknown) =>
            JSON.stringify(obj)
    ): string {
        const txt = [
            `${this.constructor.name}: ${this.message}`,
            `@${this.tag}:${this.fqn}`
        ];
        if (this.args !== undefined && this.args !== null) {
            txt.push(`args: ${stringify(this.args)}`);
        }
        if (this.cause !== undefined && this.cause !== null) {
            txt.push(`cause: ${stringify(this.cause)}`);
        }
        return txt.join(joiner);
    }
}

const err = new VeChainSDKError(
    'packages/core/src/errors/VeChainSDKError.ts!28',
    'invalid data type',
    { data: 'invalid' },
    new Error('invalid data type')
);
console.log(err.toString('\n\t'));
