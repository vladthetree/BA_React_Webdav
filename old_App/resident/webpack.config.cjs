const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: './resident/src/index.js',

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'resident'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_TLS_REJECT_UNAUTHORIZED: JSON.stringify('0'),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './resident/public/manifest.json', to: 'manifest.json' },
        { from: './resident/public/pwa-192x192.png', to: 'pwa-192x192.png' },
        { from: './resident/public/pwa-512x512.png', to: 'pwa-512x512.png' },
        { from: './resident/public/robots.txt', to: 'robots.txt' },
        { from: './resident/public/favicon.ico', to: 'favicon.ico' },
        { from: './resident/src/sw.js', to: 'sw.js' },
      ],
    }),
  ],
};
