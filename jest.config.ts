import type { Config } from "@jest/types"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config.InitialProjectOptions = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
    "<rootDir>/src/tests/customMatchers.ts",
  ],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/tests/**/*.test.[jt]s?(x)"],
  globalSetup: "<rootDir>/src/tests/jest.globalSetup.ts",
  globalTeardown: "<rootDir>/src/tests/jest.globalTeardown.ts",
}

export default createJestConfig(config)
