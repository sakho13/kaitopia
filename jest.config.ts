import { Config } from "jest"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  dir: "./",
})

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
    "<rootDir>/src/tests/customMatchers.ts",
  ],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/tests/**/*.test.[jt]s?(x)"],
  testTimeout: 30000,
}

export default createJestConfig(config)
