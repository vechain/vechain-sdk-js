## Troubleshooting

### Next.js

Projects based on [Next.js](https://nextjs.org/) need the root `tsconfig.json` file includes the options

```json
{
  "compilerOptions": {
    "target": "es2020",
    "types": [
      "@testing-library/jest-dom"
    ]
  }
}
```
to define the runtime and the test framework to be compatible with the
[ECMAScript 2020](https://262.ecma-international.org/11.0/)
language specifications.

An example of **Next.js** [tsconfig.json](../apps/sdk-nextjs-integration/tsconfig.json) is available in
the module [sdk-nextjs-integration](../apps/sdk-nextjs-integration).

**Next.js** caches data types when dependencies are installed and the project is built. To be sure
the options defined in `tsconfig.json` are effective when changed,
delete the directories `.next`, `node_modules` and the file `next-env.d.ts`
from the root directory of the project, then rebuild the project.

### HTTP Tracing

To aid debugging of http request to thor blockchain, if the environment variable: `SDK_TRACE` is set to `true`, each http request and response will be logged to console.