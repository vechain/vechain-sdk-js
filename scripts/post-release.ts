import * as fs from 'fs';
import * as path from 'path';

// variable packages should be all the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));

const updatePackageVersions = (version: string): void => {
    const packageNames = [];

    for (const pkg of packages) {
        const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
        const pkgJsonPath = path.resolve(pkgPath, './package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        packageNames.push(pkgJson.name);
    }

    // Update version on sdk-hardhat-integration sample app
    const appPath = path.resolve(__dirname, '../apps/sdk-hardhat-integration');
    const appPackageJsonPath = path.resolve(appPath, './package.json');
    const appPackageJson = JSON.parse(
        fs.readFileSync(appPackageJsonPath, 'utf8')
    );
    appPackageJson.version = version;
    fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));

    for (const dep of Object.keys(appPackageJson.dependencies)) {
        if (packageNames.includes(dep)) {
            appPackageJson.dependencies[dep] = version;
        }
    }

    fs.writeFileSync(
        appPackageJsonPath,
        JSON.stringify(appPackageJson, null, 2)
    );

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
