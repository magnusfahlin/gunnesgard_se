const Path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LoaderOptionsPlugin = require("webpack").LoaderOptionsPlugin;
const WriteFilePlugin = require("write-file-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'source-map',
  entry: ["./client/src/"],
  output: {
    path: Path.join(__dirname, "build/client"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: ["client/src"]
            }
          }
        ]
      },
      {
        test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        loader: "file-loader?name=[name].[ext]" // <-- retain original file name
      },
      {
        test: /.js$/,
        loader: "babel-loader",
        include: Path.join(__dirname, "client/src"),
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react", "stage-0"]
        }
      }
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      SAME_ORIGIN: JSON.stringify(process.env.SAME_ORIGIN)
    }),
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
      filename: "index.html",
      inject: "body"
    }),
    new LoaderOptionsPlugin({
      debug: true
    }),
    new WriteFilePlugin()
  ]
};
