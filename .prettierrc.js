module.exports = {
	arrowParens: 'avoid',
	singleQuote: true,
	trailingComma: 'all',
	printWidth: 80,
	tabWidth: 2,
	useTabs: false,

	jsxSingleQuote: true,
	bracketSameLine: false,
	bracketSpacing: true,

	arrowParens: 'avoid',
	endOfLine: 'lf',
	quoteProps: 'as-needed',
	proseWrap: 'preserve',

	overrides: [
		{
			files: '*.json',
			options: {
				printWidth: 200,
			},
		},
		{
			files: '*.md',
			options: {
				proseWrap: 'always',
				printWidth: 100,
			},
		},
	],
};
