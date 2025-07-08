# Smart Accounts

A **Smart Account** is an account whose implementation resides in a **Smart Contract**, and implements the [ERC-4337 interface](https://eips.ethereum.org/EIPS/eip-4337#account-contract-interface). 

A **Smart Account** can be controlled by one or more **Owners**, which can be a [Local](/docs/accounts/local) or [JSON-RPC Account](/docs/accounts/jsonRpc) (if supported). The **Owner Account** is responsible for signing User Operations (transactions) on behalf of the **Smart Account**, which are then broadcasted to the Network via a [Bundler](https://eips.ethereum.org/EIPS/eip-4337#bundling).

:::note
**Compatibility Note**

As ERC-4337 is not enshrined on the protocol, this means that Smart Accounts are incompatible with Viem's Transaction APIs such as `sendTransaction` and `writeContract`.

Sending "transactions" can be achieved by broadcasting a **User Operation** to a **Bundler**, which will then broadcast it to the Network shortly after.

The most common Actions for **User Operations** are:

- [`sendUserOperation`](/account-abstraction/actions/bundler/sendUserOperation) (also supports [Contract Writes](/account-abstraction/actions/bundler/sendUserOperation#contract-calls))
- [`estimateUserOperationGas`](/account-abstraction/actions/bundler/estimateUserOperationGas)
- [`getUserOperation`](/account-abstraction/actions/bundler/getUserOperation)
- [`getUserOperationReceipt`](/account-abstraction/actions/bundler/getUserOperationReceipt)

Once Account Abstraction is enshrined on the protocol, we anticipate the above Actions will become redundant in favor of Viem's Transaction APIs.
:::