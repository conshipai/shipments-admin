const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const publicPath = process.env.PUBLIC_URL || 'auto';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      publicPath: publicPath,
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
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
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      },
      hot: true,
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws'
      }
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
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
              plugins: []
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'shipmentsAdmin',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
            eager: true
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.20.0'
          },
          axios: {
            singleton: true,
            requiredVersion: '^1.6.2'
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        'process.env.API_URL': JSON.stringify(process.env.API_URL || 'https://api.gcc.conship.ai'),
        'process.env.SHELL_URL': JSON.stringify(process.env.SHELL_URL || 'https://shell.gcc.conship.ai')
      })
    ],
    optimization: isProduction ? {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      }
    } : {}
  };
};
