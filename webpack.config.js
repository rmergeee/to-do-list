const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "assets/[hash][ext][query]", // щоб картинки потрапляли в /assets/
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i, // підтримка зображень
        type: "asset/resource", // замінює file-loader
      },
      {
        test: /\.html$/i, // щоб обробляти <img src="..."> в HTML
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  devServer: {
    static: "./dist",
    hot: true,
    liveReload: true,
    open: true, // автоматично відкриє браузер
  },
  devtool: "inline-source-map",
};
