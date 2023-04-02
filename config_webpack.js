const path = require("path");
module.exports = {
  entry: './mermaid/jisonTransformer.ts',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",

      },
    {
        test:/\.(jison)$/,
        loader: path.resolve('jison-loader.js'),
    }

    ],

  },

}