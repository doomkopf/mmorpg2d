// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")

module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
}
