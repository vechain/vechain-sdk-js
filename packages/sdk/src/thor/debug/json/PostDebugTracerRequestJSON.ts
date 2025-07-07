/**
 * [PostDebugTracerRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/PostDebugTracerRequest)
 */
interface PostDebugTracerRequestJSON {
    name?: string; // structLogger 4byte call noop prestate unigram bigram trigram evmdis opcount null
    config?: unknown;
    target: string; // hex string
}

export { type PostDebugTracerRequestJSON };
