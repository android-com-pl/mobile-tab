# Mobile Tab Component

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab) [![Total Downloads](https://img.shields.io/packagist/dt/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab) [![GitHub Sponsors](https://img.shields.io/badge/Donate-%E2%9D%A4-%23db61a2.svg?&logo=github&logoColor=white&labelColor=181717)](https://github.com/android-com-pl/mobile-tab?sponsor=1)

A [Flarum](https://flarum.org) extension. Adds a bottom tab on mobile.

![Imgur](https://i.imgur.com/QGrWQyP.png)

### Installation

Install with composer:

```sh
composer require acpl/mobile-tab
```

### Updating

```sh
composer update acpl/mobile-tab
php flarum cache:clear
```

### Extending

You can add, modify, and delete items in the mobile tab using your own extension.
Read: [https://docs.flarum.org/extend/extending-extensions/](https://docs.flarum.org/extend/extending-extensions/)

1. Install `acpl/mobile-tab` as your extension's composer dependency or add it as an [optional dependency](https://docs.flarum.org/extend/extending-extensions/#optional-dependencies) in your `composer.json`.
2. Add `acpl-mobile-tab` to your extension's **webpack.config.js** to ensure proper bundling:
```js
const config = require("flarum-webpack-config");

module.exports = config({
  useExtensions: ["acpl-mobile-tab"],
});
```
3. You can now import and use mobile tab components in your extension. Here are some **examples** of how to modify the mobile tab:
```jsx
import { components } from "@acpl-mobile-tab";
import { extend } from "flarum/common/extend";

const { MobileTab, MobileTabItem } = components;

export default () => {
  // Extend the items method of MobileTab prototype
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

If you are using TypeScript, add the following path to your [tsconfig.json](https://github.com/flarum/flarum-tsconfig/blob/main/README.md) to enable type hints for the mobile tab components in your code editor:

```json
{
  "extends": "flarum-tsconfig",
  "compilerOptions": {
    "paths": {
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
