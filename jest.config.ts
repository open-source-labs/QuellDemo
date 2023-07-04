import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  projects: [
    {
      displayName: 'dom',
      preset: "ts-jest",
      testEnvironment: "jsdom",
      modulePathIgnorePatterns: ["<rootDir>/dist/", "quell-server", "server"],
      moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
      },
      setupFilesAfterEnv: ["./jest.setup.js"],
    },
    {
      displayName: 'node',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testPathIgnorePatterns: ["dist", "client"],
    },
  ],
  collectCoverage: true,
};

export default config;
