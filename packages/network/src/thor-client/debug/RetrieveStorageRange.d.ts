/**
 * Return type for retrieve storage range function
 */
export interface RetrieveStorageRange {
    /**
     * The next key to be used for the next retrieve storage range call.
     */
    nextKey: string | null;

    /**
     * The data is non-nullable, but an empty object is returned if no data is found.
     */
    storage: Record<
        string,
        {
            /**
             * Storage key.
             */
            key: string;

            /**
             * Storage value.
             */
            value: string;
        }
    >;
}
