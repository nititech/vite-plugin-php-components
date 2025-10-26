# vite-plugin-php-components

[![npm](https://img.shields.io/npm/dt/vite-plugin-php-components?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-php-components) ![GitHub Repo stars](https://img.shields.io/github/stars/nititech/vite-plugin-php-components?label=GitHub%20Stars&style=for-the-badge) [![GitHub](https://img.shields.io/github/license/nititech/vite-plugin-php-components?color=blue&style=for-the-badge)](https://github.com/nititech/vite-plugin-php-components/blob/master/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/nititech/vite-plugin-php-components?style=for-the-badge) [![Issues](https://img.shields.io/github/issues/nititech/vite-plugin-php-components?style=for-the-badge)](https://github.com/nititech/vite-plugin-php-components/issues)

A Vite plugin to transpile [PHP-Components](https://packagist.org/packages/nititech/html-components) into pure PHP calls.\
This plugin is intended to be used with [vite-plugin-php@>=3.0.0-beta](https://www.npmjs.com/package/vite-plugin-php) and [PHP-Components](https://packagist.org/packages/nititech/html-components)

```ts
// vite.config.js
import { defineConfig } from 'vite';
import usePHP from 'vite-plugin-php';
import transpilePHPComponents from 'vite-plugin-php-components';

export default defineConfig({
	plugins: [
		transpilePHPComponents(), // This plugin must be defined before the vite-plugin-php call
		usePHP(),
	],
});
```

## What does this plugin do?

The [PHP-Components](https://packagist.org/packages/nititech/html-components) package on Packagist allows you to define class based components, similar to those in React.\
This plugin transpiles these HTML or React like structured components into the appropriate PHP class calls.

In the end you would have something like this in your code base:

```php
<?/* Some *.php file */?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	</head>
	<body>
		<layouts.Centered
			label="O-la-la"
			search="<?= $_GET['search']; ?>">
			<a href="/">
				<components.Button>
					Go to home
				</components.Button>
			</a>
		</layouts.Centered>
	</body>
</html>
```

This code will be transpiled during dev and build into code similar to this:

```php
<?/* Some *.php file */?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	</head>
	<body>
		<?php $c_1760322029416 = new \layouts\Centered(['label' => 'O-la-la', 'search' => $_GET['search']]); ?>
			<a href="/">
				<?php $c_1759963459668 = new \components\Button([]); ?>
					Go to home
				<?php $c_1759963459668->close(); ?>
			</a>
		<?php $c_1760322029416->close(); ?>
	</body>
</html>
```

## Configuration

This plugin automatically checks if you have installed [PHP-Components](https://packagist.org/packages/nititech/html-components) via Packagist.\
⚠️ If not: it will throw an error and stop the dev server/ build process.

You can disable this check:

```ts
transpilePHPComponents({
	skipLibCheck: true,
});
```

## Support

Love open source? Enjoying my project?\
Your support can keep the momentum going! Consider a donation to fuel the creation of more innovative open source software.

| via Ko-Fi                                                                         | Buy me a coffee                                                                                                                                                 | via PayPal                                                                                                                                                             |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y2ALMG) | <a href="https://www.buymeacoffee.com/donnikitos" target="_blank"><img src="https://nititech.de/donate-buymeacoffee.png" alt="Buy Me A Coffee" width="174"></a> | <a href="https://www.paypal.com/donate/?hosted_button_id=EPXZPRTR7JHDW" target="_blank"><img src="https://nititech.de/donate-paypal.png" alt="PayPal" width="174"></a> |
