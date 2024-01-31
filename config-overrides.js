const path = require("path");

module.exports = {
  paths: (reactPaths) => {
    reactPaths.appPublic = path.resolve(__dirname, "public");
    reactPaths.appHtml = path.resolve(__dirname, "public/index.html");
    reactPaths.appSrc = path.resolve(__dirname, "src/renderer");
    reactPaths.appIndexJs = path.resolve(__dirname, "src/renderer/index.tsx");
    return reactPaths;
  },
  webpack: (reactConfig, env) => {
    reactConfig = modifyCRAConfigForTypia(reactConfig);

    return reactConfig;
  },
};

function modifyCRAConfigForTypia(reactConfig) {
  // 1. babel-loader to ts-loader
  //   {
  //   test: /\.(js|mjs|jsx|ts|tsx)$/,
  //   include: 'C:\\Users\\chunr\\myproject\\js-space\\test-electron\\src\\renderer',
  //   loader: 'C:\\Users\\chunr\\myproject\\js-space\\test-electron\\node_modules\\babel-loader\\lib\\index.js',
  //   options: {
  //     customize: 'C:\\Users\\chunr\\myproject\\js-space\\test-electron\\node_modules\\babel-preset-react-app\\webpack-overrides.js',
  //     presets: [Array],
  //     babelrc: false,
  //     configFile: false,
  //     cacheIdentifier: 'development:babel-plugin-named-asset-import@0.3.8:babel-preset-react-app@10.0.1:react-dev-utils@12.0.1:react-scripts@5.0.1',
  //     plugins: [Array],
  //     cacheDirectory: true,
  //     cacheCompression: false,
  //     compact: false
  //   }
  // },
  reactConfig.module.rules[1].oneOf[3] = {
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: "ts-loader",
  };

  // 2. remove ForkTsCheckerWebpackPlugin
  // useTypeScript &&
  // new ForkTsCheckerWebpackPlugin({
  //   async: isEnvDevelopment,
  //   typescript: {
  //     typescriptPath: resolve.sync("typescript", {
  //       basedir: paths.appNodeModules,
  //     }),
  //     configOverwrite: {
  //       compilerOptions: {
  //         sourceMap: isEnvProduction
  //           ? shouldUseSourceMap
  //           : isEnvDevelopment,
  //         skipLibCheck: true,
  //         inlineSourceMap: false,
  //         declarationMap: false,
  //         noEmit: true,
  //         incremental: true,
  //         tsBuildInfoFile: paths.appTsBuildInfoFile,
  //       },
  //     },
  //     context: paths.appPath,
  //     diagnosticOptions: {
  //       syntactic: true,
  //     },
  //     mode: "write-references",
  //     // profile: true,
  //   },
  //   issue: {
  //     // This one is specifically to match during CI tests,
  //     // as micromatch doesn't match
  //     // '../cra-template-typescript/template/src/App.tsx'
  //     // otherwise.
  //     include: [
  //       { file: "../**/src/**/*.{ts,tsx}" },
  //       { file: "**/src/**/*.{ts,tsx}" },
  //     ],
  //     exclude: [
  //       { file: "**/src/**/__tests__/**" },
  //       { file: "**/src/**/?(*.){spec|test}.*" },
  //       { file: "**/src/setupProxy.*" },
  //       { file: "**/src/setupTests.*" },
  //     ],
  //   },
  //   logger: {
  //     infrastructure: "silent",
  //   },
  // }),
  reactConfig.plugins.splice(8, 1);
  return reactConfig;
}
