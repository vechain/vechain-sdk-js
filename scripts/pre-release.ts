import util from 'util';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const exec = util.promisify(child_process.exec);

// variable packages should be all the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const updatePackageVersions = (version: string): void => {
    const packageNames = [];

    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        pkgJson.version = version;
        packageNames.push(pkgJson.name);
        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    }

    // if a package json contains a dependency on another package in this repo, update it to the new version
    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

        if (pkgJson.dependencies != null) {
            for (const dep of Object.keys(pkgJson.dependencies)) {
                if (packageNames.includes(dep)) {
                    pkgJson.dependencies[dep] = version;
                }
            }
        }

        fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
    }

    // Update versions in the docs directory
    const docsPath = path.resolve(__dirname, `../docs`);
    const docsJsonPath = path.resolve(docsPath, './package.json');
    const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));
    docsJson.version = version;
    fs.writeFileSync(docsJsonPath, JSON.stringify(docsJson, null, 2));

    if (docsJson.dependencies != null) {
        for (const dep of Object.keys(docsJson.dependencies)) {
            if (packageNames.includes(dep)) {
                docsJson.dependencies[dep] = version;
            }
        }
    }

    fs.writeFileSync(docsJsonPath, JSON.stringify(docsJson, null, 2));
};

const preparePackages = async () => {
    const version = process.argv[2];

    // NOTE: Remote the beta tag from the version in the future
    if (!version?.match(/^\d+\.\d+\.\d+(-beta\.\d+)?$/)) {
        console.error(
            `🚨 You must specify a semantic version as the first argument  🚨`
        );
        process.exit(1);
    }

    console.log(' Install:');
    console.log('\t- 📦 Installing dependencies...');
    await exec('yarn');
    console.log('\t- ✅  Installed!');

    console.log(' Build:');
    console.log('\t- 📦 Building packages...');
    await exec('yarn build');
    console.log('\t- ✅  Built!');

    console.log(' Test:');
    console.log('\t- 🧪 Testing packages...');
    console.log('\t- ✅  Success!');

    console.log(' Version:');
    console.log(`\t- 🏷 Updating package versions to ${version}...`);
    updatePackageVersions(version);
    console.log('\t- ✅  Updated!');

    console.log('\n______________________________________________________\n\n');
    console.log(' Publish:');
    console.log(
        `\t- Run 'yarn changeset publish' to publish the packages, then release also on GitHub.`
    );
    console.log('\n______________________________________________________\n\n');
};

preparePackages().catch((e) => {
    console.error(e);
    process.exit(1);
});
