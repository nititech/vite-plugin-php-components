import trim from './trim';

const phpBlockRegExp = /<\?(php|=)(.+?)\?>/gis;
const escapedPhpBlockRegExp = /␀␀(\d+?)␀␀/gis;

export function escapePhpBlock(
	code: string,
	phpBlocks: Map<string, [string, string]>,
) {
	return code.replace(phpBlockRegExp, (match, p1, p2) => {
		const i = phpBlocks.size;
		phpBlocks.set(`${i}`, [p1, p2.trim()]);

		return `␀␀${i}␀␀`;
	});
}

export function unescapePhpBlocks(
	code: string,
	phpBlocks: Map<string, [string, string]>,
) {
	return code.replace(escapedPhpBlockRegExp, (match, p1) => {
		const block = phpBlocks.get(p1);
		phpBlocks.delete(p1);

		return `<?${block?.join(' ')} ?>`;
	});
}

export function makePHPArray(
	attrs: Record<string, string>,
	phpBlocks: Map<string, [string, string]>,
) {
	const attrPairs = Object.entries(attrs).map((item) => {
		const key = item[0].replace(/'/g, "\\'");

		let value = item[1];
		// Is value pure PHP?
		if (
			value.startsWith('␀␀') &&
			value.endsWith('␀␀') &&
			!value.substring(2, value.length - 2).includes('␀␀')
		) {
			value = value.replace(escapedPhpBlockRegExp, (match, p1) => {
				let block = phpBlocks.get(p1)?.[1] || "''";
				phpBlocks.delete(p1);

				return trim(block, ';', 'end');
			});
		}
		// value is either a string or mixed with PHP blocks
		else {
			value = value
				.replace(/'/g, "\\'")
				.replace(escapedPhpBlockRegExp, (match, p1) => {
					const block = phpBlocks.get(p1)?.[1] || "''";
					phpBlocks.delete(p1);

					return `'.(${trim(block, ';', 'end')}).'`;
				});

			value = `'${value}'`;

			if (value.endsWith(").''")) {
				value = value.substring(0, value.length - 3);
			}
		}

		if (key === '...') {
			return `...${trim(value, ';', 'end')}`;
		}

		return `'${key}' => ${value}`;
	});

	return `[${attrPairs.join(', ')}]`;
}
