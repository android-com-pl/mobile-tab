import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import listItems from 'flarum/common/helpers/listItems';
import type { Children, Vnode } from 'mithril';

import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import MobileTabItemsRegistryForum from '../MobileTabItemsRegistryForum';

export default class MobileTab extends Component {
  view(vnode: Vnode<ComponentAttrs, this>): Children {
    return (
      <nav className="MobileTab">
        <ul className="MobileTab-items">{listItems(this.items().toArray())}</ul>
      </nav>
    );
  }

  items() {
    const registeredItems = new MobileTabItemsRegistryForum().items();

    const settings = app.forum.attribute<string[]>('acplMobileTabItems');
    const items = new ItemList<Children>();
    settings.forEach((item: string) => {
      if (registeredItems.has(item)) {
        items.add(item, registeredItems.get(item));
      }
    });

    return items;
  }
}
