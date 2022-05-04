const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
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
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		})
	],
    mode: 'production',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};
