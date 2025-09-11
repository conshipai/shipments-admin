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
    
    // FIX: Define process.env variables for the browser
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: 'production',
        API_URL: 'https://api.gcc.conship.ai'
      })
    }),
    
    // Alternative: Provide process polyfill
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};
