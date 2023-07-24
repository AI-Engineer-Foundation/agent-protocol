module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ["dist"],
  extends: ["standard-with-typescript", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  rules: {
    quotes: ["error", "single", { avoidEscape: true }],
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-extraneous-class": "off",
  },
};
