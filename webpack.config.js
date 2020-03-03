var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: './src/index.ts',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['.js', '.ts', '.css']
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)?$/,
				use: 'awesome-typescript-loader',
				include: [
					path.resolve(__dirname, 'src')
				]
			}
		]
	},
	devServer: {
		publicPath: '/',
		compress: true,
		port: 3000,
		index: 'index.html',
		historyApiFallback: true
	},
	externals: [nodeExternals()]
};
