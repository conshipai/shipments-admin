// webpack.config.js - COMPLETE WORKING VERSION
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'https://shipments-admin.gcc.conship.ai/',
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    fallback: {
      // Add polyfills for Node.js core modules
      "process": require.resolve("process/browser")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shipmentsAdmin',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App'
      },
      shared: {
        react: { 
          singleton: true,
          requiredVersion: '^18.0.0'
        },
        'react-dom': { 
          singleton: true,
          requiredVersion: '^18.0.0'
        },
        'react-router-dom': { 
          singleton: true,
          requiredVersion: '^6.0.0'
        },
        axios: {
          singleton: true
        },
        'lucide-react': {
          singleton: true
        }
      }
    }),
    
    // FIX FOR PROCESS ERROR - Define environment variables
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.API_URL': JSON.stringify('https://api.gcc.conship.ai'),
      'process.env.PUBLIC_URL': JSON.stringify('https://shipments-admin.gcc.conship.ai'),
      'process.env.SHELL_URL': JSON.stringify('https://shell.gcc.conship.ai'),
    }),
    
    // Provide process globally
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
