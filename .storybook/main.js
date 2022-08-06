const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: ['@storybook/addon-docs', '@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-controls', '@storybook/addon-essentials'],
	framework: '@storybook/react',
	staticDirs: ['./static'],
	webpackFinal: async (config, { configType }) => {
		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				extensions: config.resolve.extensions
			})
		]
		return config
	}
}
