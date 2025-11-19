"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForkDetector = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../utils");
const sdk_core_1 = require("@vechain/sdk-core");
const http_1 = require("../../http");
const galacticaForkCache = new Map();
// Cache TTL in milliseconds for negative results (5 minutes)
const NEGATIVE_CACHE_TTL = 5 * 60 * 1000;
// Track if we've found the Galactica fork on any revision
let galacticaForkDetected = false;
class ForkDetector {
    httpClient;
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
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
    async isGalacticaForked(revision) {
        // If we've already detected Galactica fork on any revision, return true immediately
        // This is because once a hard fork happens, it's permanent
        if (galacticaForkDetected) {
            return true;
        }
        revision ??= 'best';
        if (!sdk_core_1.Revision.isValid(revision)) {
            throw new sdk_errors_1.InvalidDataType('GalacticaForkDetector.isGalacticaForked()', 'Invalid revision. Must be a valid block number or ID.', { revision });
        }
        const revisionKey = String(revision);
        // Check cache first
        const cachedResult = galacticaForkCache.get(revisionKey);
        const now = Date.now();
        // If we have a cached positive result or a non-expired negative result
        if (cachedResult !== undefined) {
            // Positive results are kept indefinitely
            if (cachedResult.result) {
                galacticaForkDetected = true;
                return true;
            }
            // Negative results expire after TTL
            if (now - cachedResult.timestamp < NEGATIVE_CACHE_TTL) {
                return false;
            }
        }
        // If cache miss or expired negative result, make the request
        const block = (await this.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.blocks.get.BLOCK_DETAIL(revision), {
            query: (0, utils_1.buildQuery)({ expanded: true })
        }));
        if (block === null) {
            // Cache the negative result with TTL
            galacticaForkCache.set(revisionKey, {
                result: false,
                timestamp: now
            });
            return false;
        }
        const result = block.baseFeePerGas !== undefined;
        // Cache the result
        galacticaForkCache.set(revisionKey, { result, timestamp: now });
        // If fork is detected, set the global flag
        if (result) {
            galacticaForkDetected = true;
        }
        return result;
    }
    /**
     * Detects if the current network is on the Galactica fork by checking the best block.
     * This is an alias for isGalacticaForked('best').
     *
     * @param {string | number} revision - Block number or ID (e.g., 'best', 'finalized', or numeric)
     * @returns {Promise<boolean>} A promise that resolves to true if Galactica fork is detected, false otherwise.
     */
    async detectGalactica(revision = 'best') {
        return await this.isGalacticaForked(revision);
    }
    /**
     * Clears the Galactica fork detection cache.
     * This is mainly useful for testing purposes.
     */
    clearCache() {
        galacticaForkCache.clear();
        galacticaForkDetected = false;
    }
}
exports.ForkDetector = ForkDetector;
