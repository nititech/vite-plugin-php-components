# vite-plugin-php-components

[![npm downloads](https://img.shields.io/npm/dt/vite-plugin-php-components?style=for-the-badge)](https://www.npmjs.com/package/vite-plugin-php-components) [![GitHub stars](https://img.shields.io/github/stars/nititech/vite-plugin-php-components?label=GitHub%20Stars&style=for-the-badge)](https://github.com/nititech/vite-plugin-php-components) [![GitHub license](https://img.shields.io/github/license/nititech/vite-plugin-php-components?color=blue&style=for-the-badge)](https://github.com/nititech/vite-plugin-php-components/blob/master/LICENSE) [![GitHub last commit](https://img.shields.io/github/last-commit/nititech/vite-plugin-php-components?style=for-the-badge)](https://github.com/nititech/vite-plugin-php-components/commits/master) [![GitHub issues](https://img.shields.io/github/issues/nititech/vite-plugin-php-components?style=for-the-badge)](https://github.com/nititech/vite-plugin-php-components/issues)

Write class-based PHP components as HTML-like elements in files processed by Vite.
This plugin converts component tags into calls to [`nititech/html-components`](https://packagist.org/packages/nititech/html-components) before [`vite-plugin-php`](https://www.npmjs.com/package/vite-plugin-php) executes the PHP.

```php
<components.Button type="submit">
    Save changes
</components.Button>
```

becomes:

```php
<?php $c_123456789 = new \components\Button(['type' => 'submit']); ?>
    Save changes
<?php $c_123456789->close(); ?>
```

## Requirements

- Vite `>6.0.0`
- [`vite-plugin-php`](https://github.com/donnikitos/vite-plugin-php) `>=3.0.0`
- PHP `>=7.0` with Composer
- [`nititech/html-components`](https://github.com/donnikitos/php-html-components)

Prop spreading uses PHP array unpacking with string keys and requires PHP `>=8.1`.

## Installation

Install the Vite plugins:

```sh
npm install --save-dev vite-plugin-php vite-plugin-php-components
```

Install the PHP component library:

```sh
composer require nititech/html-components
```

Load Composer's autoloader from your PHP entry point. Your application components must also be available through Composer or another autoloader.

```php
<?php

require __DIR__ . '/vendor/autoload.php';
```

## Configuration

Add both plugins to your Vite config. `transpilePHPComponents()` must come before `usePHP()` so component tags are transpiled before PHP runs.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import transpilePHPComponents from 'vite-plugin-php-components';
import usePHP from 'vite-plugin-php';

export default defineConfig({
	plugins: [transpilePHPComponents(), usePHP()],
});
```

The plugin checks for `vendor/nititech/html-components` under the Vite project root when a build starts. If your Composer dependencies live elsewhere, disable that check:

```ts
transpilePHPComponents({
	skipLibCheck: true,
});
```

Disabling the check does not remove the runtime dependency on `nititech/html-components`.

## Component Syntax

Use a dot-separated tag name to address a namespaced PHP class. For example,
`<layouts.Centered>` maps to `\layouts\Centered`.

```php
<layouts.Centered
    title="Search"
    query="<?= $_GET['query'] ?? ''; ?>">
    <components.Button type="submit">
        Search
    </components.Button>
</layouts.Centered>
```

The plugin converts paired components into a constructor call and a matching `close()` call:

```php
<?php $c_123456789 = new \layouts\Centered([
    'title' => 'Search',
    'query' => $_GET['query'] ?? '',
]); ?>
    <?php $c_987654321 = new \components\Button(['type' => 'submit']); ?>
        Search
    <?php $c_987654321->close(); ?>
<?php $c_123456789->close(); ?>
```

The generated variable names are internal implementation details.
The examples use placeholders for readability; generated output uses inline PHP calls.

### Self-closing Components

Components without child content use the static `closed()` method:

```php
<components.Icon name="search" />
```

becomes:

```php
<?php \components\Icon::closed(['name' => 'search']); ?>
```

### Attribute Values

Static values become PHP strings:

```php
<components.Button type="submit" class="button-primary" />
```

A value containing only a PHP output block stays a native PHP expression:

```php
<components.Message variant="<?= $variant; ?>" />
```

You can also mix text and PHP in one value:

```php
<components.Avatar class="avatar avatar-<?= $size; ?>" />
```

## Prop Spreading

Use the `...` attribute to merge an array into the component props:

```php
<components.Button
    ...="<?= ['type' => 'submit', 'disabled' => $isDisabled]; ?>"
    class="button-primary">
    Save
</components.Button>
```

Explicit props that follow the spread use PHP array unpacking semantics.

Prop spreading is useful when a component forwards selected props to another component:

```php
<?php

namespace components;

class StyledButton extends \HTML\Component {
    public function render() {
        ?>
        <components.Button
            ...="<?= $this->__props__->filter(['*', '!class']); ?>"
            class="button-primary">
            <?= $this->children; ?>
        </components.Button>
        <?php
    }
}
```

See the [`nititech/html-components` prop documentation](https://github.com/donnikitos/php-html-components#props--escaping) for filtering and escaping behavior.

## Native Element Spreading

You can use the same syntax to spread attributes onto standard HTML elements:

```php
<button
    ...="<?= $this->__props__->filter(['*', '!class']); ?>"
    class="button-primary">
    <?= $this->children; ?>
</button>
```

The plugin rewrites a native element with a spread attribute to the library's `\HTML\Element` component, then transpiles it like any other component:

```php
<HTML.Element
    element="button"
    ...="<?= $this->__props__->filter(['*', '!class']); ?>"
    class="button-primary">
    <?= $this->children; ?>
</HTML.Element>
```

The rewrite handles paired elements and common HTML void elements such as `img`, `input`, and `meta`. Native elements without a `...` attribute remain unchanged.

Avoid entity-encoded double quotes such as `&quot;` in other attributes on a native element that uses spreading.
The current rewrite reconstructs parsed attributes with double-quoted values and cannot preserve that case safely.

## Issues

Report bugs and request features in the
[GitHub issue tracker](https://github.com/nititech/vite-plugin-php-components/issues).

## Support

If this project helps you, you can support its continued development:

| Ko-fi                                          | Buy Me a Coffee                                            | PayPal                                                                              |
| ---------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [Support on Ko-fi](https://ko-fi.com/Y8Y2ALMG) | [Buy me a coffee](https://www.buymeacoffee.com/donnikitos) | [Donate with PayPal](https://www.paypal.com/donate/?hosted_button_id=EPXZPRTR7JHDW) |

## License

[MIT](https://github.com/nititech/vite-plugin-php-components/blob/master/LICENSE)
