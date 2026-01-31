import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import { debounce } from 'flarum/common/utils/throttleDebounce';
import app from 'flarum/forum/app';
import type { Children, Vnode } from 'mithril';
import { MobileTabItemDefinition } from '../../common/types';
import MobileTabItemsRegistryForum from '../data/MobileTabItemsRegistryForum';
import MobileTabItem from './MobileTabItem';

export default class MobileTab extends Component {
  private lastScrollTop = 0;
  private scrollThreshold = app.forum.attribute<number>('acplMobileTabScrollThreshold') ?? 80;
  private isHidden = false;

  oncreate(vnode: Vnode<ComponentAttrs, this>) {
    super.oncreate(vnode);

    if (app.forum.attribute<boolean>('acplMobileTabHideOnScroll') ?? true) {
      addEventListener('scroll', this.handleScroll, { passive: true });
    }
  }

  onremove(vnode: Vnode<ComponentAttrs, this>) {
    super.onremove(vnode);
    removeEventListener('scroll', this.handleScroll);
  }

  view(vnode: Vnode<ComponentAttrs, this>): Children {
    return (
      <nav className="MobileTab">
        <ul className="MobileTab-items">
          {this.items()
            .toArray()
            .filter(({ canView }) => (typeof canView === 'function' ? canView() : (canView ?? true)))
            .map((item) => (
              <li key={item.itemName}>
                {item.forumComponent ? (
                  m(item.forumComponent, { definition: item })
                ) : (
                  <MobileTabItem
                    href={typeof item.href === 'function' ? item.href() : item.href}
                    icon={item.icon}
                    target={item.isNewTab ? '_blank' : undefined}
                    external={item.isInternal === undefined ? false : !item.isInternal}
                  >
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

  show = () => {
    if (!this.isHidden) return;
    this.element.classList.remove('MobileTab--hidden');
    this.element.removeAttribute('inert');
    this.isHidden = false;
  };

  hide = () => {
    if (this.isHidden) return;
    this.element.classList.add('MobileTab--hidden');
    this.element.setAttribute('inert', '');
    this.isHidden = true;
  };

  handleScroll = (event: Event) => {
    const scrollTop = window.pageYOffset;

    this.resetScrollReference();

    if (scrollTop <= 0) {
      this.show();
      this.lastScrollTop = 0;
      return;
    }

    // Ignore small movements
    if (Math.abs(scrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }

    if (scrollTop > this.lastScrollTop) {
      this.hide();
    } else {
      this.show();
    }

    this.lastScrollTop = scrollTop;
  };

  /**
   * Reset the reference point when scrolling stops.
   * This prevents small, accumulated deltas from triggering visibility changes immediately after the user pauses and resumes scrolling.
   */
  private resetScrollReference = debounce(150, () => {
    this.lastScrollTop = window.pageYOffset;
  });
}
