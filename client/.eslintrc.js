module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "simple-import-sort",
    "import",
    "prettier",
  ],
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  settings: {
    react: {
      version: "17.0",
    },
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error", // make sure all imports are at the top
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-extraneous-dependencies": "off",
    "arrow-body-style": ["error", "as-needed"],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
  },
  ignorePatterns: [".eslintrc.js", "craco.config.js", "src/setupTests.js"],
};
