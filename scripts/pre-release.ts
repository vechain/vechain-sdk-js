import util from 'util';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const exec = util.promisify(child_process.exec);

const writeJson = (filePath: string, data: unknown): void => {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
};

const bumpWorkspaceDeps = (
    pkgJson: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> },
    packageNames: string[],
    version: string
): void => {
    for (const field of ['dependencies', 'devDependencies'] as const) {
        const deps = pkgJson[field];
        if (deps == null) {
            continue;
        }
        for (const dep of Object.keys(deps)) {
            if (packageNames.includes(dep)) {
                deps[dep] = version;
            }
        }
    }
};

const packages = fs
    .readdirSync(path.resolve(__dirname, '../packages'))
    .filter((pkg) =>
        fs.existsSync(path.resolve(__dirname, `../packages/${pkg}/package.json`))
    );

const updatePackageVersions = (version: string): void => {
    const packageNames = [];

    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        pkgJson.version = version;
        packageNames.push(pkgJson.name);
        writeJson(pkgJsonPath, pkgJson);
    }

    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        bumpWorkspaceDeps(pkgJson, packageNames, version);
        writeJson(pkgJsonPath, pkgJson);
    }

    const docsJsonPath = path.resolve(__dirname, '../docs/package.json');
    const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));
    docsJson.version = version;
    bumpWorkspaceDeps(docsJson, packageNames, version);
    writeJson(docsJsonPath, docsJson);

    const appsPath = path.resolve(__dirname, '../apps');
    const appPackages = fs
        .readdirSync(appsPath)
        .filter((app) =>
            fs.existsSync(path.resolve(appsPath, app, 'package.json'))
        );

    for (const app of appPackages) {
        const appPackageJsonPath = path.resolve(appsPath, app, 'package.json');
        const appPackageJson = JSON.parse(
            fs.readFileSync(appPackageJsonPath, 'utf8')
        );
        appPackageJson.version = version;
        bumpWorkspaceDeps(appPackageJson, packageNames, version);
        writeJson(appPackageJsonPath, appPackageJson);
    }
};

const preparePackages = async () => {
    const version = process.argv[2];

    // NOTE: Remote the beta tag from the version in the future
    if (!version?.match(/^\d+\.\d+\.\d+(-rc\.\d+)?$/)) {
        console.error(
            `🚨 You must specify a semantic version as the first argument  🚨`
        );
        process.exit(1);
    }

    if (process.argv.includes('--version-only')) {
        console.log(' Version:');
        console.log(`\t- 🏷 Updating package versions to ${version}...`);
        updatePackageVersions(version);
        console.log('\t- ✅  Updated!');
        return;
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
    await exec('yarn test:solo');
    console.log('\t- ✅  Success!');

    console.log(' Version:');
    console.log(`\t- 🏷 Updating package versions to ${version}...`);
    updatePackageVersions(version);
    console.log('\t- ✅  Updated!');

    console.log('\n______________________________________________________\n\n');
    console.log(' Publish:');
    console.log(`\t- Run 'yarn changeset publish' to publish the packages, then release also on GitHub.`);
    console.log('\n______________________________________________________\n\n');
};

preparePackages().catch((e) => {
    console.error(e);
    process.exit(1);
});
