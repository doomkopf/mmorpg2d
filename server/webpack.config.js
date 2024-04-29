// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  target: "node",
  optimization: {
    innerGraph: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: false,
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  output: {
    filename: "app.js",
    iife: false,
  },
};
