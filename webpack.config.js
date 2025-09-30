const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',       // точка входу
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,                 // очищає dist перед новою збіркою
  },
  mode: 'development',           // для розробки
  module: {
    rules: [
      {
        test: /\.css$/i,         // завантаження CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // шаблон HTML
    }),
  ],
  devServer: {
    static: './dist',
    hot: true,
  },
  devtool: 'inline-source-map',  // карти коду для дебагу
};