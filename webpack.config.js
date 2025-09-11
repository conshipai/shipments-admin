const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const publicUrl = isProduction 
    ? 'https://shipments-admin.gcc.conship.ai/' 
    : 'http://localhost:3002/';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: publicUrl,
      // NO library or libraryTarget - Module Federation handles this
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
            singleton: true,
            requiredVersion: '^1.6.0'
          },
          'lucide-react': {
            singleton: true,
            requiredVersion: '^0.294.0'
          }
        }
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ],
    devServer: isProduction ? undefined : {
      port: 3002,
      host: '0.0.0.0',
      hot: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    }
  };
};
