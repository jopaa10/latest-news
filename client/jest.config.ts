/** @type {import('ts-jest').JestConfigWithTsJest} **/
import type { Config } from "jest";

const config: Config = {
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  transform: {
    "^.+.tsx?$": "ts-jest",
  },
  testEnvironment: "jest-environment-jsdom",
  preset: "ts-jest",
  moduleNameMapper: {
    "\\.scss$": "identity-obj-proxy",
  },
};
export default config;
