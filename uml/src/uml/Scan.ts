import * as ts from 'typescript';

function load(path: string): ts.SourceFile {
    const source = ts.sys.readFile(path);
    if (source !== undefined) {
        return ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
    }
    throw new Error(`Unable to read file: ${path}`);
}

function scan(node: ts.Node): void {
    ts.forEachChild(node, (node) => {
        console.log(node);
    });
}

// Example usage
const path = './test.ts'; // Path to your TypeScript file
scan(load(path));
