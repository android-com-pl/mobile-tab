import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import type { Children, Vnode } from 'mithril';
import MobileTabItem from '../../common/components/MobileTabItem';
import { MobileTabItemDefinition } from '../../common/types';
import MobileTabItemsRegistryForum from '../MobileTabItemsRegistryForum';

export default class MobileTab extends Component {
  view(vnode: Vnode<ComponentAttrs, this>): Children {
    return (
      <nav className="MobileTab">
        <ul className="MobileTab-items">
          {this.items()
            .toArray()
            .map((item) => (
              <li key={item.itemName}>
                {item.forumComponent ? (
                  m(item.forumComponent, { definition: item })
                ) : (
                  <MobileTabItem href={typeof item.href === 'function' ? item.href() : item.href} icon={item.icon}>
                    {item.label}
                  </MobileTabItem>
                )}
              </li>
            ))}
        </ul>
      </nav>
    );
  }

  items() {
    const registeredItems = new MobileTabItemsRegistryForum().items();

    const settings = app.forum.attribute<string[]>('acplMobileTabItems');
    const items = new ItemList<MobileTabItemDefinition>();
    settings.forEach((item: string) => {
      if (registeredItems.has(item)) {
        items.add(item, registeredItems.get(item));
      }
    });

    return items;
  }
}
