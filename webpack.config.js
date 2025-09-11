const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    // CRITICAL: Set the public path to the actual deployment URL
    publicPath: process.env.PUBLIC_URL || 'https://shipments-admin.gcc.conship.ai/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    // Clean the output directory before build
    clean: true,
  },
  devServer: {
    port: 3002,
    host: '0.0.0.0',
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    hot: true,
    // Serve static files properly
    static: {
      directory: path.join(__dirname, 'dist'),
    },
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
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      // This app EXPOSES itself as a remote
      name: 'shipmentsAdmin',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.jsx',
      },
      shared: {
        ...require('./package.json').dependencies,
        react: {
          singleton: true,
          requiredVersion: require('./package.json').dependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: require('./package.json').dependencies['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: require('./package.json').dependencies['react-router-dom'],
        },
        axios: {
          singleton: true,
          requiredVersion: require('./package.json').dependencies.axios,
        },
      },
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV || 'production',
        API_URL: process.env.API_URL || 'https://api.gcc.conship.ai',
      }),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // Add this to provide process for browser
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
};
