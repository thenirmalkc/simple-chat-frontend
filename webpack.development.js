const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
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
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src/template.html')
    }),
    new webpack.ProvidePlugin({
      React: 'react'
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
  },
  devServer: {
    watchFiles: ['src/**/*'],
    // https: {
    //   key: fs.readFileSync(path.resolve('cert/key.pem')),
    //   cert: fs.readFileSync(path.resolve('cert/cert.pem'))
    // },
    historyApiFallback: true
  }
};
