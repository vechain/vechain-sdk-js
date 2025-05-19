#!/usr/bin/env node

/**
 * Custom build script for the core package
 * This handles the path aliases correctly for both JavaScript and TypeScript declaration files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clean the dist directory
if (fs.existsSync('./dist')) {
  fs.rmSync('./dist', { recursive: true, force: true });
}
fs.mkdirSync('./dist', { recursive: true });

console.log('Building JavaScript bundles...');
// Run tsup for the JavaScript compilation
execSync('tsup-node src/index.ts --format cjs,esm --sourcemap', { stdio: 'inherit' });

// Create a temporary tsconfig.build.json for declaration files
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfigBuildPath = path.resolve(__dirname, 'tsconfig.build.json');

// Read the original tsconfig.json
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

// Create a specialized config for declaration generation
const dtsConfig = {
  extends: "../../tsconfig.json",
  compilerOptions: {
    ...tsconfig.compilerOptions,
    baseUrl: ".",
    outDir: "./dist",
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false,
    paths: {
      "@vcdm/*": ["./src/vcdm/*"],
      "@vcdm": ["./src/vcdm"],
      "@errors/*": ["./src/errors/*"],
      "@errors": ["./src/errors"],
      "@certificate/*": ["./src/certificate/*"],
      "@certificate": ["./src/certificate"],
      "@transaction/*": ["./src/transaction/*"],
      "@transaction": ["./src/transaction"],
      "@hdkey/*": ["./src/hdkey/*"],
      "@hdkey": ["./src/hdkey"],
      "@keystore/*": ["./src/keystore/*"],
      "@keystore": ["./src/keystore"],
      "@cryptography/*": ["./src/keystore/cryptography/*"],
      "@cryptography": ["./src/keystore/cryptography"],
      "@secp256k1/*": ["./src/secp256k1/*"],
      "@secp256k1": ["./src/secp256k1"],
      "@utils/*": ["./src/utils/*"],
      "@utils": ["./src/utils"]
    }
  },
  include: ["./src/**/*.ts"],
  exclude: ["./tests/**/*.ts", "node_modules", "dist"]
};

// Write the build-specific tsconfig
fs.writeFileSync(tsconfigBuildPath, JSON.stringify(dtsConfig, null, 2));

// Run tsc to generate declaration files
console.log('Generating TypeScript declaration files...');
try {
  execSync(`tsc --project ${tsconfigBuildPath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error generating declaration files:', error);
  process.exit(1);
}

// Clean up the temporary file
fs.unlinkSync(tsconfigBuildPath);

console.log('Build completed successfully!'); 