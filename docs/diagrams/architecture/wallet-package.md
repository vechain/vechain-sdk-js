# Wallet Package C4 Architecture diagram
Main diagram for the `wallet package`.
It represents the architecture of the `wallet package` with its most important components.

The **Wallet** interface encompasses fundamental wallet functionalities. Both the **Base Wallet** and **HD Wallet** classes adhere to this interface. Should you desire to develop a different type of wallet, you must adhere to the standard wallet interface.

```mermaid
C4Context
    title "Vechain SDK architecture overview: wallet package"

    Boundary(b0, "wallet", "package") {
        Boundary(b1, "Wallets") {
            System(base-wallet, "Base Wallet", "Base wallet")
            System(hd-wallet, "HD Wallet", "HD wallet")
        }
    }
```