const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    publicPath: 'https://shipments-admin.gcc.conship.ai/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
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
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shipmentsAdmin',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/bootstrap.js',  // Expose bootstrap instead of App directly
      },
      shared: {
        react: { 
          singleton: true,
          requiredVersion: false,
          eager: false
        },
        'react-dom': { 
          singleton: true,
          requiredVersion: false,
          eager: false
        },
        'react-router-dom': { 
          singleton: true,
          requiredVersion: false,
          eager: false
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: 'production',
      }),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};
