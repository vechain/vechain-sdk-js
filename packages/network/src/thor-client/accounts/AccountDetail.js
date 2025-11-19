"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDetail = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Represents detailed account information.
 *
 * Implements the {@link AccountData} interface.
 */
class AccountDetail {
    /**
     * Return the hexadecimal expression of the wei VET value of the balance.
     */
    balance;
    /**
     * Return the hexadecimal expression of the wei VTHO value of the energy balance.
     */
    energy;
    /**
     * Return `true` if the account is a smart contract, otherwise `false`.
     */
    hasCode;
    /**
     * Returns the balance of the account in {@link VET}.
     */
    get vet() {
        return sdk_core_1.VET.of(sdk_core_1.Units.formatEther(sdk_core_1.FixedPointNumber.of(this.balance)));
    }
    /**
     * Returns the energy balance of the account in {@link VTHO}.
     */
    get vtho() {
        return sdk_core_1.VTHO.of(sdk_core_1.Units.formatEther(sdk_core_1.FixedPointNumber.of(this.energy)));
    }
    /**
     * Constructs a new instance of the class.
     *
     * @param {AccountData} accountData - The data to initialize the account with.
     */
    constructor(accountData) {
        this.balance = accountData.balance;
        this.energy = accountData.energy;
        this.hasCode = accountData.hasCode;
    }
}
exports.AccountDetail = AccountDetail;
