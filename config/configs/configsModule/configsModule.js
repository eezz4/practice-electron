"use strict";

const configsModuleMisc = require("./configsModuleMisc");

module.exports = function configsModule(
  MiniCssExtractPlugin,
  hasJsxRuntime,

  fs,
  path,
  paths,
  isEnvDevelopment,
  isEnvProduction,

  shouldUseSourceMap,
  shouldUseReactRefresh
) {
  return {
    strictExportPresence: true,
    rules: [
      // Handle node_modules packages that contain sourcemaps
      shouldUseSourceMap && {
        enforce: "pre",
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        loader: require.resolve("source-map-loader"),
      },
      {
        // "oneOf" will traverse all following loaders until one will match the requirements.
        // When no loader matches it will fall back to the "file" loader at the end of the loader list.
        oneOf: [
          ...configsModuleMisc(
            MiniCssExtractPlugin,
            fs,
            path,
            paths,
            isEnvDevelopment,
            isEnvProduction,
            shouldUseSourceMap
          ),

          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: "ts-loader",
          },

          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve("babel-loader"),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve("babel-preset-react-app/dependencies"),
                  { helpers: true },
                ],
              ],
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,

              // Babel sourcemaps are needed for debugging into node_modules
              // code.  Without the options below, debuggers like VSCode
              // show incorrect code and set breakpoints on the wrong lines.
              sourceMaps: shouldUseSourceMap,
              inputSourceMap: shouldUseSourceMap,
            },
          },

          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed by webpacks internal loaders.
            exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            type: "asset/resource",
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ].filter(Boolean),
  };
};
