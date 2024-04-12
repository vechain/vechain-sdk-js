# RPC Proxy Package C4 Architecture diagram
Main diagram for the `rpc-proxy package`.
It represents the architecture of the `rpc-proxy package` with its most important components.

```mermaid
C4Context
    title "Vechain SDK architecture overview: rpc-proxy package"

    Boundary(b0, "rpc-proxy", "package") {
        System(rpc-proxy, "PRC Proxy", "Proxy Thor's RESTful API to Eth JSON-RPC")
    }
```