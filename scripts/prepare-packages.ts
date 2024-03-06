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
    }

    // Update versions in the docs directory
    const docsPath = path.resolve(__dirname, `../docs`);
    const docsJsonPath = path.resolve(docsPath, './package.json');
    const docsJson = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8'));

    if (docsJson.dependencies != null) {
        for (const dep of Object.keys(docsJson.dependencies)) {
            if (packageNames.includes(dep)) {
                docsJson.dependencies[dep] = version;
            }
        }
    }

    fs.writeFileSync(docsJsonPath, JSON.stringify(docsJson, null, 2));
};

updatePackageVersions('0.0.14');
