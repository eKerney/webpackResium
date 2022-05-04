const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlTagsPlugin = require("html-webpack-tags-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (_env, args) => ({
	module: {
		rules: [
		{
			test:/\.(js|jsx)$/,
			exclude:/node_modules/,
			use: {
			   loader: 'babel-loader',
			},
		},
		{
		  test: /\.css$/,
		  use: ["style-loader", "css-loader" ]
		}
		],
	},
	plugins: [
		// new HtmlWebpackPlugin({
		// 	template: "./src/index.html"
		// }),

        new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
        }),
        new CopyPlugin({
        patterns: [
            {
            from: "node_modules/cesium/Build/Cesium",
            to: "cesium",
            },
        ],
        }),
        new HtmlPlugin({
        template: "./src/index.html"
        }),
        new HtmlTagsPlugin({
        append: false,
        tags: ["cesium/Widgets/widgets.css", "cesium/Cesium.js"],
        }),
        ...(args.mode === "production" ? [] : [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()]),
	],
    //mode: 'production',
    mode: args.mode === "production" ? "production" : "development",
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    externals: {
        cesium: "Cesium"
      }
});