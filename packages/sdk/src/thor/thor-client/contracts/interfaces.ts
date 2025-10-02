/**
 * Shared interfaces for the contracts module
 */

/**
 * Interface for the ContractsModule to avoid circular imports
 */
export interface ContractsModule {
    httpClient: any;
    thorClient: any;
}
