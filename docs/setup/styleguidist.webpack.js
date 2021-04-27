/* eslint-disable import/no-extraneous-dependencies */
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// local constants
const sourcePath = path.resolve(__dirname, "../..", "src");

module.exports = () => ({
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".jsx", "scss"],
    alias: { "beautiful-react-diagrams": sourcePath },
  },
  devServer: {
    disableHostCheck: true,
    contentBase: sourcePath,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.png$/,
        loader: "url-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {},
      },
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new MiniCssExtractPlugin({ filename: "beautiful-react-diagrams.dev.css" }),
  ],
});
