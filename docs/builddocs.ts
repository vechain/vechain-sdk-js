import * as fs from 'fs';
import * as path from 'path';

const FILE_TAG = '[example]';
const CODE_BLOCK_HEADER = '```typescript { name=<name>, category=example }';
const CODE_BLOCK = '```';
const CURRENT_DIR = path.resolve();
const TEMPLATE_DIR = path.join(CURRENT_DIR, 'templates');

function getSnippetFilePath(tagLine: string): string {
    const snippetFileRelPath = tagLine
        .replace(FILE_TAG, '')
        .replace('(', '')
        .replace(')', '')
        .trim();
    const snippetFileAbsPath = path.join(CURRENT_DIR, snippetFileRelPath);
    return snippetFileAbsPath;
}

function getSnippetName(tagLine: string): string {
    const snippetFileAbsPath = getSnippetFilePath(tagLine);
    return path.basename(snippetFileAbsPath).toLowerCase().replace('.ts', '');
}

function getSnippetContent(tagLine: string): string {
    console.log(`\t\tGetting snippet from: ${tagLine}`);
    const snippetFileAbsPath = getSnippetFilePath(tagLine);
    const snippetContent = fs.readFileSync(snippetFileAbsPath, 'utf8');
    return snippetContent;
}

function buildTemplate(templateFileName: string): void {
    console.log(`\tBuilding file ${templateFileName}`);
    try {
        const templateFilePath = path.join(TEMPLATE_DIR, templateFileName);
        const outputFilePath = path.join(CURRENT_DIR, templateFileName);
        const templateContent = fs
            .readFileSync(templateFilePath, 'utf8')
            .split('\n');
        for (
            let lineIndex = 0;
            lineIndex < templateContent.length;
            lineIndex++
        ) {
            if (templateContent[lineIndex].includes(FILE_TAG)) {
                const tagLine = templateContent[lineIndex];
                const snippetContent = getSnippetContent(tagLine);
                const snippetName = getSnippetName(tagLine);
                fs.appendFileSync(
                    outputFilePath,
                    `${CODE_BLOCK_HEADER.replace('<name>', snippetName)}\n`
                );
                fs.appendFileSync(outputFilePath, `${snippetContent}\n`);
                fs.appendFileSync(outputFilePath, `${CODE_BLOCK}\n`);
            } else {
                fs.appendFileSync(
                    outputFilePath,
                    `${templateContent[lineIndex]}\n`
                );
            }
        }
    } catch (e) {
        console.log(`\tUnable to build template ${templateFileName}`);
        throw e;
    }
}

function getTemplateFiles(): string[] {
    const files = fs
        .readdirSync(TEMPLATE_DIR)
        .filter((f) => f.toLowerCase().endsWith('.md'));
    console.log(`\t${files.length} template markdown files found`);
    return files;
}

function main(): void {
    console.log('Replacing code snippets in template files:');
    const mdTemplates = getTemplateFiles();
    for (const mdTemplate of mdTemplates) {
        buildTemplate(mdTemplate);
    }
}

main();
