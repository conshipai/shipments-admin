const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const publicUrl = process.env.PUBLIC_URL || 'https://shipments-admin.gcc.conship.ai';
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: isProduction ? `${publicUrl}/` : 'http://localhost:3002/',
      clean: true
    },
    
    resolve: {
      extensions: ['.jsx', '.js', '.json'],
    },
    
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        }
      ]
    },
    
    plugins: [
      new ModuleFederationPlugin({
        name: 'shipmentsAdmin',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.jsx',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: deps.react,
            eager: true
          },
          'react-dom': {
            singleton: true,
            requiredVersion: deps['react-dom'],
            eager: true
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: deps['react-router-dom']
          }
        }
      }),
      
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      })
    ],
    
    devServer: {
      port: 3002,
      host: '0.0.0.0',
      historyApiFallback: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
      },
      hot: true,
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws'
      }
    },
    
    optimization: {
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
    },
    
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};
