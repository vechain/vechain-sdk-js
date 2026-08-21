import { InvalidDataType } from '@vechain/sdk-errors';
import { buildQuery, thorest } from '../../utils';
import { type BlockDetail } from '../blocks/types';
import { type AccountData } from '../accounts';
import { Revision } from '@vechain/sdk-core';
import { type HttpClient, HttpMethod } from '../../http';

/**
 * EIP-2935 HISTORY_STORAGE address. Thor deploys this facade at the Interstellar fork block.
 */
const INTERSTELLAR_HISTORY_STORAGE_ADDRESS =
    '0x0000F90827F1C53a10cb7A02335B175320002935';

interface CacheEntry {
    result: boolean;
    timestamp: number;
}

const galacticaForkCache = new Map<string, CacheEntry>();
const interstellarForkCache = new Map<string, CacheEntry>();
const NEGATIVE_CACHE_TTL = 5 * 60 * 1000;
let galacticaForkDetected = false;
let interstellarForkDetected = false;

async function lookupCachedFork(
    cache: Map<string, CacheEntry>,
    isDetected: () => boolean,
    markDetected: () => void,
    methodName: string,
    compute: (revision: string | number) => Promise<boolean>,
    revision?: string | number
): Promise<boolean> {
    if (isDetected()) {
        return true;
    }

    revision ??= 'best';
    if (!Revision.isValid(revision)) {
        throw new InvalidDataType(
            methodName,
            'Invalid revision. Must be a valid block number or ID.',
            { revision }
        );
    }

    const revisionKey = String(revision);
    const now = Date.now();
    const cachedResult = cache.get(revisionKey);

    if (cachedResult !== undefined) {
        if (cachedResult.result) {
            markDetected();
            return true;
        }

        if (now - cachedResult.timestamp < NEGATIVE_CACHE_TTL) {
            return false;
        }
    }

    const result = await compute(revision);
    cache.set(revisionKey, { result, timestamp: now });
    if (result) {
        markDetected();
    }
    return result;
}

class ForkDetector {
    constructor(private readonly httpClient: HttpClient) {}

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
    public async isGalacticaForked(
        revision?: string | number
    ): Promise<boolean> {
        return await lookupCachedFork(
            galacticaForkCache,
            () => galacticaForkDetected,
            () => {
                galacticaForkDetected = true;
            },
            'GalacticaForkDetector.isGalacticaForked()',
            async (rev) => {
                const block = (await this.httpClient.http(
                    HttpMethod.GET,
                    thorest.blocks.get.BLOCK_DETAIL(rev),
                    {
                        query: buildQuery({ expanded: true })
                    }
                )) as BlockDetail | null;

                return block?.baseFeePerGas !== undefined;
            },
            revision
        );
    }

    /**
     * Checks if the given block is Interstellar-forked by inspecting chain state.
     *
     * Criteria:
     * - the EIP-2935 History Storage account has code (deployed at the Interstellar
     *   fork block).
     *
     * @param revision Block number or ID (e.g., 'best', 'finalized', or numeric).
     * @returns `true` if Interstellar-forked, otherwise `false`.
     * @throws {InvalidDataType} If the revision is invalid.
     */
    public async isInterstellarForked(
        revision?: string | number
    ): Promise<boolean> {
        return await lookupCachedFork(
            interstellarForkCache,
            () => interstellarForkDetected,
            () => {
                interstellarForkDetected = true;
            },
            'ForkDetector.isInterstellarForked()',
            async (rev) => {
                const account = (await this.httpClient.http(
                    HttpMethod.GET,
                    thorest.accounts.get.ACCOUNT_DETAIL(
                        INTERSTELLAR_HISTORY_STORAGE_ADDRESS
                    ),
                    {
                        query: buildQuery({ revision: String(rev) })
                    }
                )) as AccountData | null;

                return account?.hasCode === true;
            },
            revision
        );
    }

    /**
     * Detects if the current network is on the Galactica fork by checking the best block.
     * This is an alias for isGalacticaForked('best').
     *
     * @param {string | number} revision - Block number or ID (e.g., 'best', 'finalized', or numeric)
     * @returns {Promise<boolean>} A promise that resolves to true if Galactica fork is detected, false otherwise.
     */
    public async detectGalactica(
        revision: string | number = 'best'
    ): Promise<boolean> {
        return await this.isGalacticaForked(revision);
    }

    /**
     * Detects if the current network is on the Interstellar fork by checking the best block.
     * This is an alias for isInterstellarForked('best').
     *
     * @param {string | number} revision - Block number or ID (e.g., 'best', 'finalized', or numeric)
     * @returns {Promise<boolean>} A promise that resolves to true if Interstellar fork is detected, false otherwise.
     */
    public async detectInterstellar(
        revision: string | number = 'best'
    ): Promise<boolean> {
        return await this.isInterstellarForked(revision);
    }

    /**
     * Clears the fork detection caches.
     * This is mainly useful for testing purposes.
     */
    public clearCache(): void {
        galacticaForkCache.clear();
        interstellarForkCache.clear();
        galacticaForkDetected = false;
        interstellarForkDetected = false;
    }
}

export { ForkDetector };
