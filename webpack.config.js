import HTMLWebpackPlugin from 'html-webpack-plugin';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default ({ mode = 'development' }) => ({
	mode,
	entry: './src/index.tsx',
    devtool: 'source-map',
	context: path.resolve(__dirname, 'src'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		clean: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				use: ['babel-loader'],
				include: [path.resolve(__dirname, 'src')]
			}
		]
	},
	devServer: {
		compress: true,
		hot: true,
		port: 9000
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: 'index.html'
		})
	]
});
