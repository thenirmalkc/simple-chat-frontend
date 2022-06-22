const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: {
      import: path.resolve('src/Main.jsx'),
      dependOn: ['vendors']
    },
    vendors: {
      import: [
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        '@reduxjs/toolkit',
        'react',
        'react-dom',
        'react-redux',
        'react-router-dom',
        'socket.io-client'
      ]
    }
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      },
      {
        test: /\.jsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin(),
      new CssMinimizerWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve('src/template.html'),
        minify: 'auto'
      })
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  resolve: {
    alias: {
      '@src': path.resolve('src'),
      '@components': path.resolve('src/components'),
      '@constants': path.resolve('src/constants'),
      '@pages': path.resolve('src/pages'),
      '@scss': path.resolve('src/scss'),
      '@store': path.resolve('src/store')
    }
  }
};
