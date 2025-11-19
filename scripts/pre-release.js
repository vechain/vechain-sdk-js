"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const child_process = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const exec = util_1.default.promisify(child_process.exec);
// variable packages should be all the child folders in the packages folder
const packages = fs.readdirSync(path.resolve(__dirname, '../packages'));
const updatePackageVersions = (version) => {
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
    // Update versions on sample apps
    const appsPath = path.resolve(__dirname, '../apps');
    const appPackages = fs.readdirSync(appsPath);
    for (const app of appPackages) {
        const appPath = path.resolve(appsPath, app);
        const appPackageJsonPath = path.resolve(appPath, './package.json');
        const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf8'));
        appPackageJson.version = version;
        fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));
        for (const dep of Object.keys(appPackageJson.dependencies)) {
            if (packageNames.includes(dep)) {
                appPackageJson.dependencies[dep] = version;
            }
        }
        fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));
    }
};
const preparePackages = async () => {
    const version = process.argv[2];
    // NOTE: Remote the beta tag from the version in the future
    if (!version?.match(/^\d+\.\d+\.\d+(-rc\.\d+)?$/)) {
        console.error(`🚨 You must specify a semantic version as the first argument  🚨`);
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
