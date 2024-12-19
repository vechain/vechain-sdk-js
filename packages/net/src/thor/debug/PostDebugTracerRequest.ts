import { Tracer, type TracerName } from './TracerName';

class PostDebugTracerRequest {
    readonly name?: TracerName;
    readonly config?: unknown;
    readonly target: string;

    constructor(json: PostDebugTracerRequestJSON) {
        this.name = json.name === undefined ? undefined : Tracer.of(json.name);
        this.config = json.config;
        this.target = json.target;
    }

    toJSON(): PostDebugTracerRequestJSON {
        return {
            name: this.name?.toString(),
            config: this.config,
            target: this.target
        };
    }
}

interface PostDebugTracerRequestJSON {
    name?: string;
    config?: unknown;
    target: string;
}

export { PostDebugTracerRequest, type PostDebugTracerRequestJSON };
