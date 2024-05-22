import * as fs from 'fs';
import * as path from 'path';

// variable packages should be all of the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const updatePackageVersions = (version: string): void => {
    const packageNames = [];

    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        packageNames.push(pkgJson.name);
    }

    // Update versions in the apps directory
    const appsPath = path.resolve(__dirname, '../apps');

    const appPackages = fs.readdirSync(appsPath);

    for (const app of appPackages) {
        const appPath = path.resolve(appsPath, app);
        const appPackageJsonPath = path.resolve(appPath, './package.json');
        const appPackageJson = JSON.parse(
            fs.readFileSync(appPackageJsonPath, 'utf8')
        );

        for (const dep of Object.keys(appPackageJson.dependencies)) {
            if (packageNames.includes(dep)) {
                appPackageJson.dependencies[dep] = version;
            }
        }

        fs.writeFileSync(
            appPackageJsonPath,
            JSON.stringify(appPackageJson, null, 2)
        );

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
    }
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

    console.log(' Version:');
    console.log(`\t- 🏷 Updating package versions to ${version}...`);
    updatePackageVersions(version);
    console.log('\t- ✅  Updated!');

    console.log('\n______________________________________________________\n\n');
    console.log('Now please release also on GitHub.');
};

preparePackages().catch((e) => {
    console.error(e);
    process.exit(1);
});