import * as ts from 'typescript';
import * as path_module from 'path';
import log from 'loglevel';

log.setLevel(log.levels.INFO);

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

function scan(node: ts.Node, map: Map<string, unknown>): void {
    const currentPath = path_module.normalize(node.getSourceFile().fileName);
    log.debug(currentPath);
    map.set(currentPath, new Map<string, unknown>());
    node.forEachChild((node) => {
        if (ts.isClassDeclaration(node)) {
            scanClassDeclaration(node);
        }
        if (ts.isInterfaceDeclaration(node)) {
            scanInterfaceDeclaration(node);
        } else if (ts.isExportDeclaration(node)) {
            scanExportDeclaration(node, map); // Detailed inspection
        }
        // Recursively scan children nodes
        // scan(node);
    });
}

function scanClassDeclaration(node: ts.ClassDeclaration): void {
    log.debug(node.name?.getText());
}

function scanInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
    log.debug(node.name?.getText());
}

function scanExportDeclaration(
    node: ts.ExportDeclaration,
    map: Map<string, unknown>
): void {
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
            .forEach((exportedName: string) => {
                const nextPath = path_module.join(
                    currentPath.dir,
                    exportedName + currentPath.ext
                );
                if (!map.has(nextPath)) {
                    scan(load(path_module.parse(nextPath)), map);
                }
            });
    } else if (moduleSpecifier != null) {
        // For `export * from 'module';`
        const nextPath = path_module.join(
            currentPath.dir,
            moduleSpecifier + currentPath.ext
        );
        if (!map.has(nextPath)) {
            scan(load(path_module.parse(nextPath)), map);
        }
    } else {
        log.warn(
            `Export declaration without explicit exports or module specifier`
        );
    }
}

// Example usage
const map = new Map<string, unknown>();
const path = path_module.parse('../../../packages/core/src/errors/index.ts'); // Path to your TypeScript file
scan(load(path), map);
