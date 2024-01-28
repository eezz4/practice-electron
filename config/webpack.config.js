"use strict";

const fs = require("fs");
const path = require("path");

const configsModule = require("./configs/configsModule/configsModule");
const configsPlugins = require("./configs/configsPlugins");
const configsOptimization = require("./configs/configsOptimization");
const configsResolve = require("./configs/configsResolve");
const configsMisc = require("./configs/configsMisc");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const paths = require("./paths");
const getClientEnvironment = require("./env");

// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

// Check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

// This is the production and development configuration. It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  // Variable used for enabling profiling in Production passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");

  // We will provide `paths.publicUrlOrPath` to our app as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  // Get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  const shouldUseReactRefresh = env.raw.FAST_REFRESH;

  return {
    ...configsMisc(
      fs,
      env,
      path,
      paths,
      isEnvDevelopment,
      isEnvProduction,

      shouldUseSourceMap
    ),
    module: configsModule(
      MiniCssExtractPlugin,
      hasJsxRuntime,

      fs,
      path,
      paths,
      isEnvDevelopment,
      isEnvProduction,

      shouldUseSourceMap,
      shouldUseReactRefresh
    ),

    optimization: configsOptimization(isEnvProduction, isEnvProductionProfile),

    plugins: configsPlugins(
      MiniCssExtractPlugin,
      hasJsxRuntime,

      env,
      paths,
      isEnvDevelopment,
      isEnvProduction,

      useTypeScript,
      shouldUseSourceMap,
      shouldUseReactRefresh
    ),

    resolve: configsResolve(paths, useTypeScript, isEnvProductionProfile),
  };
};
