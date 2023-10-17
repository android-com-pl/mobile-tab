# Mobile Tab Component

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab) [![Total Downloads](https://img.shields.io/packagist/dt/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab)

A [Flarum](https://flarum.org) extension. Adds a bottom tab on mobile.

![Imgur](https://i.imgur.com/QGrWQyP.png)

### Installation

Install with composer:

```sh
composer require acpl/mobile-tab:"*"
```

### Updating

```sh
composer update acpl/mobile-tab:"*"
php flarum cache:clear
```

### Extending

You can add, modify and delete items with your own extension.
Read: [https://docs.flarum.org/extend/extending-extensions/](https://docs.flarum.org/extend/extending-extensions/)

Examples:

```js
import { components } from "@acpl-mobile-tab";
import { extend } from "flarum/common/extend";

const { MobileTab, MobileTabItem } = components;

export default () => {
  extend(MobileTab.prototype, "items", (items) => {
    // Add new item
    items.add(
      "following",
      <MobileTabItem
        href={app.route("following")}
        icon="fas fa-star"
        label={app.translator.trans("my-ext.forum.my-item")}
      />,
      90,
    );

    // Add new item using custom HTML
    items.add("my-item", <div>...This is my custom item</div>, 70);

    // Remove item
    items.remove("home");
  });
};
```

If you are using TypeScript, add a path to your [tsconfig.json](https://github.com/flarum/flarum-tsconfig/blob/main/README.md) to enable type hints in your code editor:

```json
{
  "extends": "flarum-tsconfig",
  // ...
  "compilerOptions": {
    // ....
    "paths": {
      // ...
      "@acpl-mobile-tab": [
        "./vendor/acpl/mobile-tab/js/dist-typings/index.d.ts"
      ]
    }
  }
}
```

### Links

- [Packagist](https://packagist.org/packages/acpl/mobile-tab)
- [GitHub](https://github.com/android-com-pl/mobile-tab)
- [Discuss](https://discuss.flarum.org/d/28216-mobile-tab)
