/**
 * Check if the code is running in a browser.
 * @returns True if the code is running in a browser, false otherwise.
 */
const isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';

export { isBrowser };
