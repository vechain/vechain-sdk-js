/**
 * Constructs the endpoint URL for retrieving block details based on block revision.
 *
 * @param revision - The block number or ID for which to fetch details.
 * @returns The URL endpoint to fetch block details.
 */
const BLOCK_DETAIL = (revision: string | number): string =>
    `/blocks/${revision}`;

/**
 * path to Thorest API to retrieve last block
 */
const LAST_BLOCK_PATH = '/blocks/best';

export const blocks = {
    BLOCK_DETAIL,
    LAST_BLOCK_PATH
};
