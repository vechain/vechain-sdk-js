/**
 * [StorageRange](http://localhost:8669/doc/stoplight-ui/#/schemas/StorageRange)
 */
interface StorageRangeJSON {
    nextKey?: string; // string or null
    storage: unknown; // The data is non-nullable, but an empty object is returned if no data is found.
}

export { type StorageRangeJSON };
