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
        if (ts.isClassDeclaration(node)) {
            const name = node.name?.getText() ?? '<anonymous>';
            console.log(`Class: ${name}`);
            scan(node);
        } else if (ts.isInterfaceDeclaration(node)) {
            const name = node.name?.getText() ?? '<anonymous>';
            console.log(`Interface: ${name}`);
            scan(node);
        } else if (ts.isEnumDeclaration(node)) {
            const name = node.name?.getText() ?? '<anonymous>';
            console.log(`Enum: ${name}`);
            scan(node);
        } else if (ts.isMethodSignature(node) || ts.isMethodDeclaration(node)) {
            const name = node.name?.getText() ?? '<anonymous>';
            const type = node.type?.getText() ?? '<any>';
            console.log(`  - Method: ${name}: ${type}`);
            scan(node);
        } else if (
            ts.isPropertySignature(node) ||
            ts.isPropertyDeclaration(node)
        ) {
            const name = node.name?.getText() ?? '<anonymous>';
            const type = node.type?.getText() ?? '<any>';
            console.log(`  - Property: ${name}: ${type}`);
        }
    });
}

// Example usage
const path = './test.ts'; // Path to your TypeScript file
scan(load(path));
