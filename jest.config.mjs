export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@errors/(.*)$": "<rootDir>/src/errors/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!@scalar)"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
