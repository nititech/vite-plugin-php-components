import { type PluginOption, type ResolvedConfig } from 'vite';
import rewriteHTML from 'vite-plugin-html-rewrite';
import hashTagName from './utils/hashTagName';
import { existsSync, lstatSync } from 'node:fs';
import { escapePhpBlock, makePHPArray, unescapePhpBlocks } from './utils/php';

type Config = { skipLibCheck?: boolean };

export function transpilePHPComponents(config?: Config): PluginOption {
	let viteConfig: undefined | ResolvedConfig;

	const phpBlocks = new Map<string, [string, string]>();

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
		{
			name: 'escape-php',
			transform(code, id, options) {
				if (id.endsWith('.html')) {
					return {
						code: escapePhpBlock(code, phpBlocks),
					};
				}
			},
			transformIndexHtml: {
				order: 'pre',
				handler(html, ctx) {
					return escapePhpBlock(html, phpBlocks);
				},
			},
		},
		rewriteHTML([
			{
				match: (element) => {
					return element.tagName.includes('.');
				},
				order: 'pre',
				render(elementDetails, index) {
					const className =
						'\\' + elementDetails.tagName.replace(/\./g, '\\');
					const attrArray = makePHPArray(
						elementDetails.attribs,
						phpBlocks,
					);

					if (elementDetails.innerHTML.trim() !== '') {
						const varName =
							'$' + hashTagName(elementDetails.tagName);

						return `<?php ${varName} = new ${className}(${attrArray}); ?>${elementDetails.innerHTML}<?php ${varName}->close(); ?>`;
					} else {
						return `<?php ${className}::closed(${attrArray}); ?>`;
					}
				},
			},
		]),
		{
			name: 'unescape-php',
			transform(code, id, options) {
				if (id.endsWith('.html')) {
					return {
						code: unescapePhpBlocks(code, phpBlocks),
					};
				}
			},
			transformIndexHtml: {
				order: 'pre',
				handler(html, ctx) {
					return unescapePhpBlocks(html, phpBlocks);
				},
			},
		},
	];
}

export default transpilePHPComponents;
