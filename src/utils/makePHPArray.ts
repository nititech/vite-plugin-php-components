function makePHPArray(attrs: Record<string, string>) {
	const attrPairs = Object.entries(attrs).map((item) => {
		const key = item[0].replace(/'/g, "\\'");

		let value = item[1];
		// Is value pure PHP?
		if (
			value.startsWith('<?') &&
			value.endsWith('?>') &&
			!value.substring(2).includes('<?')
		) {
			value = value.replace(
				/<\?(?:php|=)(.+?)(?:;|)\s*\?>/gis,
				(match, p1) => p1.trim(),
			);
		}
		// value is either a string or mixed with PHP
		else {
			const phpBlocks: string[] = [];

			value = value
				.replace(/<\?(?:php|=)(.+?)(?:;|)\s*\?>/gis, (match, p1) => {
					phpBlocks.push(p1.trim());

					const index = phpBlocks.length - 1;

					return `␀␀${index}␀␀`;
				})
				.replace(/'/g, "\\'")
				.replace(/␀␀(\d+)␀␀/g, (match, p1) => {
					return `'.(${phpBlocks[parseInt(p1)]}).'`;
				});

			value = `'${value}'`;
		}

		return `'${key}' => ${value}`;
	});

	return `[${attrPairs.join(', ')}]`;
}

export default makePHPArray;
