import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(docsDir, 'examples');
const tsNodeRegister = `data:text/javascript,${encodeURIComponent(
    [
        'import { register } from "node:module";',
        'import { pathToFileURL } from "node:url";',
        'register("ts-node/esm", pathToFileURL("./"));'
    ].join('\n')
)}`;

const collectExampleFiles = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries
            .sort((left, right) => left.name.localeCompare(right.name))
            .map(async (entry) => {
                const fullPath = join(directory, entry.name);

                if (entry.isDirectory()) {
                    return await collectExampleFiles(fullPath);
                }

                return entry.isFile() && entry.name.endsWith('.ts')
                    ? [fullPath]
                    : [];
            })
    );

    return files.flat();
};

const runExample = async (file) =>
    await new Promise((resolve) => {
        const child = spawn(
            process.execPath,
            [
                '--disable-warning=DEP0180',
                '--import',
                tsNodeRegister,
                relative(docsDir, file)
            ],
            {
                cwd: docsDir,
                env: process.env,
                stdio: 'inherit'
            }
        );

        child.on('error', (error) => {
            console.error(error);
            resolve(1);
        });

        child.on('close', (code) => {
            resolve(code ?? 1);
        });
    });

const exampleFiles = await collectExampleFiles(examplesDir);

if (exampleFiles.length === 0) {
    console.error('No example files found.');
    process.exit(1);
}

const failed = [];

for (const file of exampleFiles) {
    const startedAt = Date.now();
    const exitCode = await runExample(file);
    const durationMs = Date.now() - startedAt;
    const displayPath = relative(docsDir, file);

    if (exitCode === 0) {
        console.log(`[PASS] ${displayPath} (${durationMs}ms)`);
    } else {
        console.error(`[FAIL] ${displayPath} (${durationMs}ms)`);
        failed.push(displayPath);
    }
}

console.log(`\nExamples: ${exampleFiles.length}`);
console.log(`Passed: ${exampleFiles.length - failed.length}`);
console.log(`Failed: ${failed.length}`);

if (failed.length > 0) {
    console.error('\nFailing examples:');
    failed.forEach((file) => {
        console.error(`- ${file}`);
    });
    process.exitCode = 1;
}
