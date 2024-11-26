const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'eval-source-map',
  devServer: {
    watchFiles: ['./src/index.html', './src/login.html'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: './src/login.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'register.html',
      template: './src/register.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
