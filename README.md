# Mobile Tab Component

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab) [![Total Downloads](https://img.shields.io/packagist/dt/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab/stats) [![GitHub Sponsors](https://img.shields.io/badge/Donate-%E2%9D%A4-%23db61a2.svg?&logo=github&logoColor=white&labelColor=181717)](https://github.com/android-com-pl/mobile-tab?sponsor=1)

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

> [!IMPORTANT]  
> These instructions are for Flarum 2.0.
> For Flarum 1.x documentation, please refer to:
> [Flarum 1.x Guide](https://github.com/android-com-pl/mobile-tab/tree/1.x?tab=readme-ov-file#extending)

You can add, modify, and delete items in the mobile tab using your own extension.
Read: [https://docs.flarum.org/2.x/extend/extending-extensions](https://docs.flarum.org/2.x/extend/extending-extensions)

1. Install `acpl/mobile-tab` as your extension's composer dependency or add it as an [optional dependency](https://docs.flarum.org/2.x/extend/extending-extensions#optional-dependencies) in your `composer.json`.

2. You can now import and use mobile tab components in your extension. Here are some **examples** of how to modify the mobile tab:
```jsx
import { extend } from "flarum/common/extend";
import LinkButton from 'flarum/common/components/LinkButton';

import MobileTab from "ext:acpl/mobile-tab/forum/components/MobileTab";

export default () => {
  // Extend the items method of MobileTab prototype
  extend(MobileTab.prototype, "items", (items) => {
    // Add new item
    items.add(
      "following",
      <LinkButton
        href={app.route("following")}
        icon="fas fa-star"
      >
        {app.translator.trans("my-ext.forum.my-item")}
      </LinkButton>,
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
      "ext:acpl/mobile-tab/forum": [
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
