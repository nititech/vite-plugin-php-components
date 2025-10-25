import { type PluginOption, type ResolvedConfig } from 'vite';
import rewriteHTML from 'vite-plugin-html-rewrite';
import hashTagName from './utils/hashTagName';
import makePHPArray from './utils/makePHPArray';
import { existsSync, lstatSync } from 'node:fs';

type Config = { skipLibCheck?: boolean };

export function transpilePHPComponents(config?: Config): PluginOption {
	let viteConfig: undefined | ResolvedConfig;

	return [
		{
			name: 'html-components-check',
			enforce: 'pre',
			configResolved(config) {
				viteConfig = config;
			},
			buildStart(options) {
				const phpLibPath = `${viteConfig?.root}/vendor/nititech/html-components`;

				if (
					!config?.skipLibCheck &&
					(!existsSync(phpLibPath) ||
						!lstatSync(phpLibPath).isDirectory())
				) {
					this.error(
						`\nLooks like 'nititech/html-components' is not installed.\nThis plugin is intended to be used with https://packagist.org/packages/nititech/html-components\n`,
					);
				}
			},
		},
		rewriteHTML([
			{
				match: (element) => {
					return element.tagName.includes('.');
				},
				order: 'pre',
				render(elementDetails, index) {
					const varName = '$' + hashTagName(elementDetails.tagName);
					const className =
						'\\' + elementDetails.tagName.replace(/\./g, '\\');

					const attrArray = makePHPArray(elementDetails.attribs);

					return `<?php ${varName} = new ${className}(${attrArray}); ?>${elementDetails.innerHTML}<?php ${varName}->close(); ?>`;
				},
			},
		]),
	];
}

export default transpilePHPComponents;
