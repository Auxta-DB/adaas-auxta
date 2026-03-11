import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: [
        "**/tests/unit/**/*.test.ts",          // unit tests
        "**/tests/integration/**/*.test.ts",   // integration tests
    ],
    moduleNameMapper: {
        "@auxta/bin/(.*)": ["<rootDir>/src/constants/$1"],
        "@auxta/api/(.*)": ["<rootDir>/src/api/$1"],
        "@auxta/global/(.*)": ["<rootDir>/src/global/$1"],
        "@auxta/types/(.*)": ["<rootDir>/src/types/$1"],
        "@auxta/constants/(.*)": ["<rootDir>/src/constants/$1"],
        "@auxta/classes/(.*)": ["<rootDir>/src/classes/$1"],
        "@auxta/lib/(.*)": ["<rootDir>/src/lib/$1"],
        "@auxta/utils/(.*)": ["<rootDir>/src/utils/$1"],
        "@auxta/errors/(.*)": ["<rootDir>/src/errors/$1"],
        "@auxta/core/(.*)": ["<rootDir>/src/core/$1"],
        "@auxta/decorators/(.*)":  ["<rootDir>/src/decorators/$1"],
        "@auxta/metadata/(.*)": ["<rootDir>/src/metadata/$1"],
        "@auxta/polyfill/crypto": ["<rootDir>/src/polyfill/crypto.node"],
        "@auxta/polyfill/buffer": ["<rootDir>/src/polyfill/buffer.node"],
        "@auxta/polyfill/net":    ["<rootDir>/src/polyfill/net.node"],
        "@auxta/polyfill/fs":     ["<rootDir>/src/polyfill/fs.node"],
        "@auxta/polyfill/process":["<rootDir>/src/polyfill/process.node"],
    }

};
export default config;