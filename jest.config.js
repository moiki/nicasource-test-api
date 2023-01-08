// import type {Config} from "@jest/types";

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // transform: {
    //     '^.+\\.[tj]s?$': 'ts-jest',
    // },
    globals: {
        "ts-jest": {
            isolatedModules: true
        }
    }
};

// export default config;