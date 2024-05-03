import { INTEGER_REGEX } from '../const';

/**
 * Checks if derivation path single component is valid
 *
 * @param component - Derivation path single component to check
 * @param index - Derivation path single component index
 * @returns True if derivation path single component is valid, false otherwise
 * @private
 */
function _checkDerivationPathSingleComponentValid(
    component: string,
    index: number
): boolean {
    // Zero component can be "m" or "number" or "number'", other components can be only "number" or "number'"
    return (
        // m
        (index === 0 ? component === 'm' : false) ||
        // "number"
        INTEGER_REGEX.test(component) ||
        // "number'"
        (INTEGER_REGEX.test(component.slice(0, -1)) && component.endsWith("'"))
    );
}

/**
 * Checks if derivation path is valid
 *
 * @param derivationPath - Derivation path to check
 * @returns True if derivation path is valid, false otherwise
 */
function isDerivationPathValid(derivationPath: string): boolean {
    // Split derivation path into parts
    const pathComponents = derivationPath.split('/');

    // Check each component
    for (let i = 0; i < pathComponents.length; i++) {
        // If single component is not valid, return false
        if (!_checkDerivationPathSingleComponentValid(pathComponents[i], i))
            return false;
    }

    return true;
}

export { isDerivationPathValid };
