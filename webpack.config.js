// Generated using webpack-cli https://github.com/webpack/webpack-cli
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;



const config = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '../server/public/app'),
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 3001
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
};

module.exports = (env) => {
  let environmentFile = 'environment.ts';
  config.mode = 'development';
  if (isProduction) {
    environmentFile = 'environment.prod.ts';
    config.mode = 'production';
  }
  
  config.plugins.push(new webpack.NormalModuleReplacementPlugin(
    new RegExp(`environment\\.ts`),
    environmentFile
  ));
  if (!env.WEBPACK_SERVE) {
    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  }
  return config;
};
