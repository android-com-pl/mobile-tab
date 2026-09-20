# Mobile Tab Component

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab) [![Total Downloads](https://img.shields.io/packagist/dt/acpl/mobile-tab.svg)](https://packagist.org/packages/acpl/mobile-tab/stats) [![GitHub Sponsors](https://img.shields.io/badge/Donate-%E2%9D%A4-%23db61a2.svg?&logo=github&logoColor=white&labelColor=181717)](https://github.com/android-com-pl/mobile-tab?sponsor=1)

A [Flarum](https://flarum.org) extension. Adds a bottom tab on mobile.

<img width="1280" height="640" alt="mobile-tab" src="https://github.com/user-attachments/assets/a4794750-2a48-4d13-848c-216c5a8ec638" />


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

Create `extendMobileTab.ts` in your extension's `js/src/common` directory:

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
      counter: () => app.forum.attribute('myCount'),
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

The `following` route, translation keys, and `myCount` forum attribute are examples: replace them with values provided by your extension. Keep forum route lookups inside callbacks so they are not evaluated in the admin panel.

Use this file in both admin and forum. Example for `js/src/admin/index.ts`:

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
> Register components that import `flarum/forum/*` in `MobileTabItemsRegistryForum`, from your forum entry point. Importing them in shared code would break the admin panel because forum modules are unavailable there.

In `js/src/forum/index.ts`:

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

Create `js/src/forum/components/MyCustomTabItem.tsx`:

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

After enabling your extension, drag the registered items from **Available items** into the desired mobile tab variants in the admin panel. Registration alone does not add items to a visible tab. Keep item IDs stable because variants store those IDs.

### Item behavior

See [`MobileTabItemDefinition`](js/src/common/types.ts) for the available properties.

- `canView` controls whether an item is rendered on the forum and defaults to `true`. It does not replace server-side permission checks.
- `href` accepts a URL or a callback returning one. Links are internal by default; use `isInternal: false` for external URLs and `isNewTab: true` to open them in a new tab.
- `counter` returns a number to display on the default item. Zero, `null`, and `undefined` hide the counter.
- `forumComponent` replaces the default item renderer and receives the definition through `this.attrs.definition`. Your component handles its own click behavior, navigation, and counter display; `canView` is still checked before rendering it.

To modify an existing item, use `items.setContent(id, { ...items.get(id), ...changes })`; to remove one, use `items.remove(id)`. Check `items.has(id)` first when the item belongs to an optional extension. Changes in the common registry affect both the admin panel and forum; use the forum registry for forum-only behavior.

## Links

- [Packagist](https://packagist.org/packages/acpl/mobile-tab)
- [GitHub](https://github.com/android-com-pl/mobile-tab)
- [Discuss](https://discuss.flarum.org/d/28216-mobile-tab)
