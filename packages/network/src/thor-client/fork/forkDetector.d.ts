import { type HttpClient } from '../../http';
declare class ForkDetector {
    private readonly httpClient;
    constructor(httpClient: HttpClient);
    /**
     * Checks if the given block is Galactica-forked by inspecting the block details.
     *
     * Criteria:
     * - baseFeePerGas is defined (indicating a possible Galactica fork).
     *
     * @param revision Block number or ID (e.g., 'best', 'finalized', or numeric).
     * @returns `true` if Galactica-forked, otherwise `false`.
     * @throws {InvalidDataType} If the revision is invalid.
     */
    isGalacticaForked(revision?: string | number): Promise<boolean>;
    /**
     * Detects if the current network is on the Galactica fork by checking the best block.
     * This is an alias for isGalacticaForked('best').
     *
     * @param {string | number} revision - Block number or ID (e.g., 'best', 'finalized', or numeric)
     * @returns {Promise<boolean>} A promise that resolves to true if Galactica fork is detected, false otherwise.
     */
    detectGalactica(revision?: string | number): Promise<boolean>;
    /**
     * Clears the Galactica fork detection cache.
     * This is mainly useful for testing purposes.
     */
    clearCache(): void;
}
export { ForkDetector };
//# sourceMappingURL=forkDetector.d.ts.map