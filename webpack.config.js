const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hot: true,
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
      name: 'shell',
      remotes: {
        // FIX: Remove the /remoteEntry.js from the base URLs since it's added automatically
        quotes: `quotes@${process.env.REACT_APP_QUOTES_URL || 'https://quotes.gcc.conship.ai'}/remoteEntry.js`,
        users: `users@${process.env.REACT_APP_USERS_URL || 'https://users.gcc.conship.ai'}/remoteEntry.js`,
        
        // FIXED: Use the correct URL without double /remoteEntry.js
        shipmentsAdmin: `shipmentsAdmin@${process.env.REACT_APP_SHIPMENTS_ADMIN_URL || 'https://shipments-admin.gcc.conship.ai'}/remoteEntry.js`,
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
        REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'https://api.gcc.conship.ai',
        REACT_APP_USERS_URL: process.env.REACT_APP_USERS_URL || 'https://users.gcc.conship.ai',
        REACT_APP_QUOTES_URL: process.env.REACT_APP_QUOTES_URL || 'https://quotes.gcc.conship.ai',
        REACT_APP_SHIPMENTS_ADMIN_URL: process.env.REACT_APP_SHIPMENTS_ADMIN_URL || 'https://shipments-admin.gcc.conship.ai',
      }),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};
