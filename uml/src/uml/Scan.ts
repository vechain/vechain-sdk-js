import * as ts from 'typescript';
import * as path_module from 'path';

function load(parsedPath: path_module.ParsedPath): ts.SourceFile {
    const fullPath = path_module.format(parsedPath);
    const source = ts.sys.readFile(fullPath);
    if (source !== undefined) {
        return ts.createSourceFile(
            fullPath,
            source,
            ts.ScriptTarget.Latest,
            true
        );
    }
    throw new Error(`Unable to read file: ${fullPath}`);
}

function scan(node: ts.Node): void {
    node.forEachChild((child) => {
        if (ts.isExportDeclaration(child)) {
            scanExportDeclaration(child); // Detailed inspection
        }
        // Recursively scan children nodes
        // scan(child);
    });
}

function scanExportDeclaration(node: ts.ExportDeclaration): void {
    const exportClause = node.exportClause;
    const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral)?.text;
    const currentPath = path_module.parse(node.getSourceFile().fileName);
    if (exportClause != null && ts.isNamedExports(exportClause)) {
        // For `export { ... } from 'module';`
        exportClause.elements
            .map(
                (element) =>
                    element.propertyName?.getText() ?? element.name.getText()
            )
            .forEach((name: string) => {
                const nextPath = path_module.join(
                    currentPath.dir,
                    name + currentPath.ext
                );
                console.log(nextPath);
            });
    } else if (moduleSpecifier != null) {
        const nextPath = path_module.join(
            currentPath.dir,
            moduleSpecifier + currentPath.ext
        );
        // For `export * from 'module';`
        console.log(nextPath);
    } else {
        console.warn(
            `Export declaration without explicit exports or module specifier`
        );
    }
}

// Example usage
const path = path_module.parse('../../../packages/core/src/errors/index.ts'); // Path to your TypeScript file
scan(load(path));
