/**
 * Constructs the endpoint URL for retrieving block details based on block revision.
 *
 * @param revision - The block number or ID for which to fetch details.
 * @returns The URL endpoint to fetch block details.
 */
const BLOCK_DETAIL = (revision: string | number): string =>
    `/blocks/${revision}`;

export const block = {
    BLOCK_DETAIL
};
