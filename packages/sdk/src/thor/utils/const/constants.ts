import { Hex } from '@common/vcdm';

/**
 * The prefix for no data.
 */
const NO_DATA = Hex.PREFIX;

/**
 * The zero value.
 */
const ZERO_VALUE = 0n;

/**
 * The function name for transferring a NFT token.
 */
const TRANSFER_NFT_FUNCTION = 'transferFrom';

/**
 * The function name for transferring a ERC20 token.
 */
const TRANSFER_TOKEN_FUNCTION = 'transfer';

/**
 * The address of the VTHO token (Energy built-in contract).
 */
const VTHO_TOKEN_ADDRESS = '0x0000000000000000000000000000456e65726779';

/**
 * The address of the Params built-in contract.
 */
const PARAMS_CONTRACT_ADDRESS = '0x0000000000000000000000000000506172616d73';

export {
    NO_DATA,
    ZERO_VALUE,
    TRANSFER_NFT_FUNCTION,
    TRANSFER_TOKEN_FUNCTION,
    VTHO_TOKEN_ADDRESS,
    PARAMS_CONTRACT_ADDRESS
};
