const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),//for Github Pages
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    historyApiFallback: true,
  },
  module: {
    // exclude node_modules
    rules: [
      // `js` and `jsx` files are parsed using `babel`
      {
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
        // `ts` and `tsx` files are parsed using `ts-loader`
      { 
        test: /\.(ts|tsx)$/, 
        loader: "ts-loader" 
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.js$/,
        loader: "source-map-loader" 
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset',
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      },
      {    
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader"
      }
    ]
    
  },
  
  // pass all js and ts files through Babel
  resolve: {
    extensions: [".*", ".js", ".jsx", ".ts", ".tsx"],    
  },
  
};