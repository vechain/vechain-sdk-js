import fastJsonStableStringify from 'fast-json-stable-stringify';
import pkg from '../../../package.json'; /**
 * Class representing errors specific to the VeChain SDK.
 * This class extends the native JavaScript `Error` object, providing additional
 * context and utility functions for debugging and error handling within the SDK.
 */
class VeChainSDKError extends Error {
    /**
     * Represents the software tag identifier expressing the **artifact and version coordinates**
     * used for logging or debugging purposes.
     *
     * This constant value is used to facilitate filtering or grouping of log messages,
     * helping developers to identify and trace operations or issues related to this specific SDK version in the application.
     */
    static readonly TAG = `vechain-sdk-js:${pkg.version}`;
    /**
     * Optional parameter to represent a set of key-value pairs representing the arguments originating the error.
     *
     * @param {Record<string, unknown>} [args] - A record object where keys are strings and values can be of any type.
     */
    readonly args?: Record<string, unknown>;

    /**
     * Represents the underlying error or reason for an operation failure.
     * Optional property that can provide additional context or details
     * about the cause of an encountered issue.
     */
    override readonly cause?: Error;
    /**
     * Fully qualified name of the element throwing this error, represented as a string in hierarchical form.
     *
     * For error generated in a method of a class, the format is
     *
     * <pre>
     * <FQN> ::= <FQP>"!"[<object>"."]<function>
     * <FQP> ::= Full Qualified Path of the file having the code described in the error
     * <object> ::= <class>|"<"<instance>">"
     * <Class> ::= Class definition for static functions.
     * <instance> ::= Class instance for instance's functions.
     * <method> :== Called function signature.
     * </pre>
     *
     * This variable is used to store the full name of a resource,
     * entity, or identifier, typically in a hierarchical or
     * namespaced format. It may include elements such as
     * namespaces, modules, classes, or methods concatenated
     * together to form a unique identifier. The specific format
     * and components depend on the context in which it is used.
     */
    readonly fqn: string;

    /**
     * Represents the software tag identifier expressing the **software artifact and version coordinates**
     */
    readonly tag: string;

    /**
     * Constructs a new instance of the class.
     *
     * @param {string} fqn - The fully qualified name of the element throwing this error.
     * @param {string} message - The error message to be used.
     * @param {Record<string, unknown>} [args] - Optional arguments providing additional context or details.
     * @param {Error} [cause] - Optional underlying cause of the error.
     * @param {string} [tag] - An optional tag identifying the error, defaults to VeChainSDKError.TAG.
     */
    constructor(
        fqn: string,
        message: string,
        args?: Record<string, unknown>,
        cause?: Error,
        tag: string = VeChainSDKError.TAG
    ) {
        super(message, { cause });
        this.args = args;
        this.fqn = fqn;
        this.tag = tag;
    }

    toString(
        joiner: string = '\n\t',
        stringify: (obj: unknown) => string = (obj: unknown) =>
            fastJsonStableStringify(obj)
    ): string {
        const txt = [
            `${this.constructor.name}: ${this.message}`,
            `@${this.tag}:${this.fqn}`
        ];
        if (this.args !== undefined && this.args !== null) {
            txt.push(`args: ${stringify(this.args)}`);
        }
        if (this.cause !== undefined && this.cause !== null) {
            txt.push(`cause: ${this.cause.toString()}`);
        }
        return txt.join(joiner);
    }
}

export { VeChainSDKError };
