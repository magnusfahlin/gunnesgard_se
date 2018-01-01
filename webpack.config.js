var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var LoaderOptionsPlugin = require("webpack").LoaderOptionsPlugin;
var WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
  devtool: "inline-source-map",
 // devtool: 'source-map',
  entry: ["./client/src/"],
  output: {
    path: path.join(__dirname, "build/client"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: "babel-loader",
        include: path.join(__dirname, 'client/src'),
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react", "stage-0"]
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/
      },
    //   {
    //     test: /\.(jpe?g|png|gif|svg)$/i,
    //     loaders: [
    //       "file-loader?hash=sha512&digest=hex&name=[hash].[ext]",
    //       "image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false"
    //     ]
    //   },
    {
          test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
          loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
      }
    ]
  },
  plugins: [
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
