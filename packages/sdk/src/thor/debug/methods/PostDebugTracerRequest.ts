import { TargetPath, type TracerName } from '@thor/debug';
import { type PostDebugTracerRequestJSON } from '@/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/debug/PostDebugTracerRequest.ts!';

/**
 * [PostDebugTracerRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/PostDebugTracerRequest)
 */
class PostDebugTracerRequest {
    /**
     * The name of the tracer. An empty name stands for the default struct logger tracer.
     */
    readonly name: TracerName | null;

    /**
     * The configuration of the tracer. It is specific to the `name`.
     */
    readonly config: unknown;

    /**
     * The unified path of the target to be traced. Currently, only the clause is supported
     */
    readonly target: TargetPath;

    /**
     * Constructs an instance of the object using the provided JSON input.
     *
     * @param {PostDebugTracerRequestJSON} json - The JSON object containing the necessary data to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error when the JSON input is invalid or does not contain the expected data format.
     */
    constructor(json: PostDebugTracerRequestJSON) {
        try {
            this.name =
                typeof json.name === 'string'
                    ? (json.name as TracerName)
                    : null;
            this.config = json.config;
            this.target = TargetPath.of(json.target);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: PostDebugTracerRequestJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of PostDebugTracerRequest to its JSON representation.
     *
     * @return {PostDebugTracerRequestJSON} The JSON object representation of the current instance.
     */
    toJSON(): PostDebugTracerRequestJSON {
        return {
            name: this.name?.toString(),
            config: this.config,
            target: this.target.toString()
        } satisfies PostDebugTracerRequestJSON;
    }
}

export { PostDebugTracerRequest };
