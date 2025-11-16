# Mobile Tab Component

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab) [![Total Downloads](https://img.shields.io/packagist/dt/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab/stats) [![GitHub Sponsors](https://img.shields.io/badge/Donate-%E2%9D%A4-%23db61a2.svg?&logo=github&logoColor=white&labelColor=181717)](https://github.com/android-com-pl/mobile-tab?sponsor=1)

A [Flarum](https://flarum.org) extension. Adds a bottom tab on mobile.

![Imgur](https://i.imgur.com/QGrWQyP.png)

## Installation

Install with composer:

```sh
composer require acpl/mobile-tab
```

## Updating

```sh
composer update acpl/mobile-tab
php flarum migrate
php flarum cache:clear
```

## Extending

> [!IMPORTANT]  
> These instructions are for Flarum 2.0.
> For Flarum 1.x documentation, please refer to:
> [Flarum 1.x Guide](https://github.com/android-com-pl/mobile-tab/tree/1.x?tab=readme-ov-file#extending)

You can add, modify, and delete items in the mobile tab using your own extension.
Read: [https://docs.flarum.org/2.x/extend/extending-extensions](https://docs.flarum.org/2.x/extend/extending-extensions/)

1. Install `acpl/mobile-tab` as your extension's composer dependency or add it as an [optional dependency](https://docs.flarum.org/2.x/extend/extending-extensions/#optional-dependencies) in your `composer.json`.
2. In the `tsconfig.json` file add `"ext:acpl/mobile-tab/*": ["../vendor/acpl/mobile-tab/js/dist-typings/*"]` to the `compilerOptions.paths` object.
3. You can now import and use the registry classes to modify the mobile tab.

### Example

Create `extendMobile.ts` in your extension's `js/common` directory:

```tsx
import MobileTabItemsRegistry from "ext:acpl/mobile-tab/common/MobileTabItemsRegistry";
import app from "flarum/common/app";
import { extend } from "flarum/common/extend";

export default () => {
  extend(MobileTabItemsRegistry.prototype, "items", (items) => {
    // Add a simple link item
    items.add("following", {
      icon: "fas fa-star",
      label: app.translator.trans("my-ext.forum.index.following_label"),
      href: () => app.route("following"),
      canView: () => !!app.session.user,
      source: "extension",
    });

    // Add an item that we plan to turn into an interactive component on the forum frontend
    items.add("my-interactive-item", {
      icon: "fas fa-rocket",
      label: app.translator.trans("my-ext.forum.my_interactive_item_label"),
      source: "extension",
    });
  });
};
```

Use this file in both admin and forum. Example for the admin side:

```tsx
import app from "flarum/admin/app";
import extendMobileTab from "../common/extendMobileTab";

app.initializers.add("my-ext/mobile-tab-example", () => {
  extendMobileTab();
  // ... other initializers
});
```

To make an item interactive on the forum, assign a component using the `forumComponent` property.

> [!NOTE]  
> Interactive components should be registered in `MobileTabItemsRegistryForum` because they import `from flarum/forum/*`.
> Registering them in the common registry would break the admin panel.

```tsx
import MobileTabItemsRegistryForum from "ext:acpl/mobile-tab/forum/data/MobileTabItemsRegistryForum";
import { extend } from "flarum/common/extend";
import app from "flarum/forum/app";
import extendMobileTab from "../common/extendMobileTab";
import MyCustomTabItem from "./components/MyCustomTabItem";

app.initializers.add("my-ext/mobile-tab-example", () => {
  extendMobileTab();

  extend(MobileTabItemsRegistryForum.prototype, "items", (items) => {
    // Get the item defined in common and enhance it for the forum
    const myItem = items.get("my-interactive-item");

    items.setContent("my-interactive-item", {
      ...myItem, // Keep icon, label, and other shared properties
      forumComponent: MyCustomTabItem, // Add the forum-only interactive component
    });
  });
  // ... other initializers
});
```

```tsx
import MobileTabComponent from "ext:acpl/mobile-tab/common/components/MobileTabComponent";
import Button from "flarum/common/components/Button";

export default class MyCustomTabItem extends MobileTabComponent {
  view() {
    const { icon, label } = this.attrs.definition;

    return (
      <Button
        className="Button MyCustomTabComponent"
        icon={icon}
        onclick={() => console.log("clicked")}
      >
        {label}
      </Button>
    );
  }
}
```

## Links

- [Packagist](https://packagist.org/packages/acpl/mobile-tab)
- [GitHub](https://github.com/android-com-pl/mobile-tab)
- [Discuss](https://discuss.flarum.org/d/28216-mobile-tab)
