const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const config = require("./config");

module.exports = env => ({
  entry: {
    "js/background": "./src/js/background.js",
    "js/content": "./src/js/content/content.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"), //, env.target
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: "babel-loader", options: { presets: ["env"] } }],
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      { from: "src/manifest.json" },
      /* { from: "src/icons", to: "icons" }, */
    ]),
    new EnvironmentPlugin(config[env.target]),
  ],
});
