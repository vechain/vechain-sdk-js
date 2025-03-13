// eslint-disable-next-line import/no-extraneous-dependencies
import * as ts from 'typescript';

function parseClass(fileName: string): string {
    const sourceFile = ts.createSourceFile(
        fileName,
        ts.sys.readFile(fileName) ?? '',
        ts.ScriptTarget.ES2015,
        /* setParentNodes */ true
    );

    let mermaidOutput = 'classDiagram\n';

    function visit(node: ts.Node): void {
        if (ts.isClassDeclaration(node) && node.name != null) {
            const className = node.name.text;
            mermaidOutput += `class ${className} {\n`;

            // Get methods and properties
            node.members.forEach((member) => {
                if (
                    ts.isPropertyDeclaration(member) &&
                    ts.isIdentifier(member.name)
                ) {
                    const propertyName = member.name.text;
                    const propertyType =
                        member.type !== null && member.type !== undefined
                            ? member.type.getText()
                            : 'any';
                    mermaidOutput += `  +${propertyName}: ${propertyType}\n`;
                }

                if (
                    ts.isMethodDeclaration(member) &&
                    ts.isIdentifier(member.name)
                ) {
                    const methodName = member.name.text;
                    mermaidOutput += `  +${methodName}()\n`;
                }
            });

            mermaidOutput += '}\n';
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return mermaidOutput;
}

const fileName = './VeChainSDKError.ts'; // Replace with your TS file path
console.log(parseClass(fileName));
