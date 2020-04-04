const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const TerserPlugin = require('terser-webpack-plugin');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
const appPath = path.resolve(fs.realpathSync(process.cwd()), '.');
const appNodeModules = path.resolve(fs.realpathSync(process.cwd()), 'node_modules');

module.exports = {
	entry: `./bootstrap/bootstrap.js`,
	devtool: 'source-map',
  node: {
    fs: 'empty',
    net: 'empty'
  },
	output: {
		filename: 'bootstrap.js',
		publicPath: publicPath,
		globalObject: `(typeof self !== 'undefined' ? self : this)`,
		path: path.resolve(__dirname, './lib/bootstrap'),
		pathinfo: true,
	},
	resolve: {
		extensions: ['.js', '.json'],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					parse: {
						ecma: 8,
					},
					compress: {
						ecma: 5,
						warnings: false,
						comparisons: false,
						inline: 2,
					},
					mangle: {
						safari10: true,
					},
					output: {
						ecma: 5,
						comments: false,
						ascii_only: true,
					},
				},
				parallel: true,
				cache: true,
				sourceMap: true,
			}),
		],
	},
	module: {
		strictExportPresence: true,
		rules: [
			{ parser: { requireEnsure: false } },
			{
				oneOf: [
					{
						test: /\.(js|mjs)$/,
						exclude: /(node_modules|bower_components)/,
						loader: require.resolve('babel-loader'),
						options: {
							cacheDirectory: true,
							// Don't waste time on Gzipping the cache
							cacheCompression: false,
							// If an error happens in a package, it's possible to be
							// because it was compiled. Thus, we don't want the browser
							// debugger to show the original code. Instead, the code
							// being evaluated would be much more helpful.
							sourceMaps: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		// Clean up the current public folder
		new WebpackCleanupPlugin(),
    // Build and output the manifest
    new ManifestPlugin({
      fileName: 'manifest.json',
      publicPath: publicPath,
    }),
		// This gives some necessary context to module not found errors, such as
		// the requesting resource.
		new ModuleNotFoundPlugin(appPath),
		// This is necessary to emit hot updates (currently CSS only):
		new webpack.HotModuleReplacementPlugin(),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		// See https://github.com/facebook/create-react-app/issues/240
		new CaseSensitivePathsPlugin(),
		// If you require a missing module and then `npm install` it, you still have
		// to restart the development server for Webpack to discover it. This plugin
		// makes the discovery automatic so you don't have to restart.
		// See https://github.com/facebook/create-react-app/issues/186
		new WatchMissingNodeModulesPlugin(appNodeModules),
	],
};
