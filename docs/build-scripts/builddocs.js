import * as fs from 'fs';
import * as path from 'path';
const FILE_TAG = '[example]';
const CODE_BLOCK_HEADER = '```typescript { name=<name>, category=example }';
const CODE_BLOCK = '```';
const CURRENT_DIR = path.resolve();
const TEMPLATE_DIR = path.join(CURRENT_DIR, 'templates');
const FILETAG_REGEX = new RegExp('\\[(.*?)Snippet]', 'g');
// Function to construct the file path for a snippet based on a tag and a tag line
function getSnippetFilePath(tag, tagLine) {
    // Remove the tag and parentheses from the tag line, then trim whitespace
    const snippetFileRelPath = tagLine
        .replace(tag, '')
        .replace('(', '')
        .replace(')', '')
        .trim();
    // Combine the current directory with the relative path to get the full path
    return path.join(CURRENT_DIR, snippetFileRelPath);
}
// Function to derive the name of a snippet from its tag and tag line
function getSnippetName(tag, tagLine) {
    const snippetFileAbsPath = getSnippetFilePath(tag, tagLine);
    return path.basename(snippetFileAbsPath).toLowerCase().replace('.ts', '');
}
// Function to extract the tag from a given tag line
function getTag(tagline) {
    let fileTag = undefined;
    const matchingArray = tagline.match(FILETAG_REGEX);
    if (matchingArray && matchingArray.length > 0) {
        fileTag = matchingArray[0];
    }
    else if (tagline.includes(FILE_TAG)) {
        fileTag = FILE_TAG;
    }
    return fileTag;
}
// Function to extract the content between two specified comments within a file
function extractContent(filePath, startComment, endComment) {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');
    // Find the start and end indexes of the comments
    const startIndex = content.indexOf(startComment);
    const endIndex = content.indexOf(endComment, startIndex + startComment.length);
    console.log('indexes', startIndex, endIndex);
    // Extract and return the content between the comments
    if (startIndex !== -1 && endIndex !== -1) {
        return content
            .substring(startIndex + startComment.length, endIndex)
            .trim();
    }
    else {
        return 'Content not found between specified comments.';
    }
}
// Function to retrieve the content of a snippet based on a tag and tag line
function getSnippetContent(tag, tagLine) {
    console.log(`\t\tGetting snippet from: ${tagLine}`);
    const snippetFileAbsPath = getSnippetFilePath(tag, tagLine);
    if (tag === FILE_TAG) {
        return fs.readFileSync(snippetFileAbsPath, 'utf8');
    }
    const snippetName = tag.replace('[', '').replace(']', '');
    return extractContent(snippetFileAbsPath, '// START_SNIPPET: ' + snippetName, '// END_SNIPPET: ' + snippetName);
}
// Function to build a template file from its filename
function buildTemplate(templateFileName) {
    console.log(`\tBuilding file ${templateFileName}`);
    try {
        const templateFilePath = path.join(TEMPLATE_DIR, templateFileName);
        const outputFilePath = path.join(CURRENT_DIR, templateFileName);
        const templateContent = fs
            .readFileSync(templateFilePath, 'utf8')
            .split('\n');
        for (let lineIndex = 0; lineIndex < templateContent.length; lineIndex++) {
            const fileTag = getTag(templateContent[lineIndex]);
            if (fileTag !== undefined) {
                const tagLine = templateContent[lineIndex];
                const snippetContent = getSnippetContent(fileTag, tagLine);
                const snippetName = getSnippetName(fileTag, tagLine);
                fs.appendFileSync(outputFilePath, `${CODE_BLOCK_HEADER.replace('<name>', snippetName)}\n`);
                fs.appendFileSync(outputFilePath, `${snippetContent}\n`);
                fs.appendFileSync(outputFilePath, `${CODE_BLOCK}\n`);
            }
            else {
                fs.appendFileSync(outputFilePath, `${templateContent[lineIndex]}\n`);
            }
        }
    }
    catch (e) {
        console.log(`\tUnable to build template ${templateFileName}`);
        throw e;
    }
}
// Function to get all the template files in the template directory
function getTemplateFiles() {
    const files = fs
        .readdirSync(TEMPLATE_DIR)
        .filter((f) => f.toLowerCase().endsWith('.md'));
    console.log(`\t${files.length} template markdown files found`);
    return files;
}
// Main function to build the template files
function main() {
    console.log('Replacing code snippets in template files:');
    const mdTemplates = getTemplateFiles();
    for (const mdTemplate of mdTemplates) {
        buildTemplate(mdTemplate);
    }
}
main();
