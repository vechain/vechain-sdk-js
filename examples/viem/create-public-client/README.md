# Create Public Client Example

This example demonstrates how the VeChain Viem SDK’s transport-based architecture allows you to fully control how HTTP requests are made inside PublicClient. It shows several real-world scenarios: using the default FetchHttpClient, creating a custom HttpClient for mocking or testing, injecting a custom transport into createPublicClient, customizing fetch options (timeouts, headers), and intercepting requests with callbacks. All clients expose the same high-level API—such as getBalance()—regardless of the underlying transport, making the system flexible, testable, and easily extensible for different environments or advanced behaviors.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github//vechain/vechain-sdk-js/tree/sdk-v3/examples/viem/create-public-client)

