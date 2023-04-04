const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config({ path: './.env' }); 

module.exports = {
  mode: 'development',
  entry: './pwa/src/index.js',

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'pwa'),
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
      "process.env": JSON.stringify(process.env),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './pwa/public/manifest.json', to: 'manifest.json' },
        { from: './pwa/public/pwa-192x192.png', to: 'pwa-192x192.png' },
        { from: './pwa/public/pwa-512x512.png', to: 'pwa-512x512.png' },
        { from: './pwa/public/robots.txt', to: 'robots.txt' },
        { from: './pwa/public/favicon.ico', to: 'favicon.ico' },
        { from: './pwa/public/audio/sampleAudio.mp3', to: 'audio/sampleAudio.mp3' },
        { from: './pwa/src/sw.js', to: 'sw.js' },
      ],
    }),
  ],
};
