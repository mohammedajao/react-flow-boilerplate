const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const modeConfiguration = (env) => require(`./build-utils/webpack.${env}`);

module.exports = ({ mode } = { mode: 'production' }) => {
  console.log(`mode is: ${mode}`);

  return merge(
    {
      mode,
      entry: './src/index.js',
      stats: 'errors-warnings',
      devServer: {
        hot: true,
        open: true,
      },
      output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
      },
      resolve: {
        fallback: {
          "fs": false,
          "tls": false,
          "net": false,
          "http": require.resolve("stream-http"),
          "https": false,
          "zlib": require.resolve("browserify-zlib") ,
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),
          "util": require.resolve("util/"),
          "crypto": require.resolve("crypto-browserify"),
          "assert": require.resolve("assert/"),
          "url": require.resolve("url/")
        }
      },
      module: {
        rules: [
          {
            test: /\.scss/,
            use: [
              MiniCssExtractPlugin.loader,
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  module: true,
                },
              },
              'sass-loader',
            ],
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-flow'],
              },
            },
          },
          {
            test: /\.jpe?g|png$/,
            exclude: /node_modules/,
            use: ['url-loader', 'file-loader'],
          },
          {
            test: /\.css$/i,
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                },
              },
              'postcss-loader',
            ],
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          process: {env: {}}
        }),
        new ESLintPlugin(),
        new MiniCssExtractPlugin(),
        new HTMLWebpackPlugin({
          template: './public/index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
      ],
    },
    modeConfiguration(mode),
  );
};
