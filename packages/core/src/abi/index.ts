// Import low level abi coder
import { lowLevel } from './low-level-abi';

// Import high level abi coder
import { highLevel } from './high-level-abi';

// Types
export * from './types.d';

// Low level and Higl level abi coders
const abi = {
    lowLevel,
    highLevel
};
export { abi };
