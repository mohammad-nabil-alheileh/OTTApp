const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Copies the app icons and web manifest next to index.html. They are plain
// files rather than imports, so they keep their names for the manifest and
// <link> tags to reference.
class CopyWebAssetsPlugin {
  constructor(directory) {
    this.directory = directory;
  }

  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.thisCompilation.tap('CopyWebAssetsPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'CopyWebAssetsPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          for (const file of fs.readdirSync(this.directory)) {
            compilation.emitAsset(
              file,
              new sources.RawSource(
                fs.readFileSync(path.join(this.directory, file)),
              ),
            );
          }
        },
      );
    });
  }
}

module.exports = {
  entry: path.resolve(__dirname, 'index.web.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    // webOS loads apps from file://, so asset paths must be relative.
    publicPath: '',
    clean: true,
  },
  resolve: {
    alias: { 'react-native$': 'react-native-web' },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
  },
  module: {
    rules: [
      {
        // async-storage's ESM build uses extensionless relative imports.
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.[jt]sx?$/,
        // async-storage ships optional chaining, which Chrome 68 can't parse.
        exclude: /node_modules\/(?!react-native-web|@react-native-async-storage)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: [
              // Older LG webOS releases ship old Chromium (webOS 5 = Chrome 68).
              ['@babel/preset-env', { targets: { chrome: '68' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: ['react-native-web'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'web/index.html') }),
    new CopyWebAssetsPlugin(path.resolve(__dirname, 'web/static')),
  ],
  devServer: {
    port: 8080,
    hot: true,
  },
};
