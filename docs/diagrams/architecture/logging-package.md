# Logging Package C4 Architecture diagram
Main diagram for the `logging package`.
It represents the architecture of the `logging package` with its most important components.

```mermaid
C4Context
    "Vechain SDK architecture overview: logging package"

    Boundary(b0, "logging", "package") {
        Boundary(b1, "Logger") {
            System(error-logger, "Error Logger", "Error logger internal function")
            System(log-logger, "Log Logger", "Log logger internal function")
            System(warning-logger, "Warning Logger", "Warning logger internal function")
        }
    }
```