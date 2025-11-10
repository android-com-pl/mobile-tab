import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import { Children, VnodeDOM } from 'mithril';
import Sortable from 'sortablejs';
import { MobileTabRegistryItem } from '../../common/types';
import MobileTabItemsRegistryAdmin from '../MobileTabItemsRegistryAdmin';

export default class MobileTabSettingsPage extends ExtensionPage {
  protected itemsSettingKey = 'acpl-mobile-tab.items';
  protected sortableKey = 'acpl-mobile-tab';
  protected sortableAvailableItems!: Sortable;
  protected sortableEnabledItems!: Sortable;
  /**
   * Sortablejs directly manipulates the DOM, which can confuse Mithril's diffing.
   * Changing this key forces a full re-render of the list, ensuring a clean sync.
   */
  protected forcedRefreshKey = 0;

  get activeKeys(): string[] {
    const raw = this.setting(this.itemsSettingKey)();
    if (Array.isArray(raw)) return raw;

    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  set activeKeys(value: string[]) {
    this.setting(this.itemsSettingKey)(JSON.stringify(value));
  }

  content(vnode: VnodeDOM<ExtensionPageAttrs, this>) {
    return (
      <div className="ExtensionPage-settings">
        <div className="container">
          <div className="Form" key={this.forcedRefreshKey} oncreate={this.onListCreate.bind(this)}>
            {this.availableItemsContent()}
            {this.enabledItemsContent()}
            <div class="Form-body">{this.submitButton()}</div>
          </div>
        </div>
      </div>
    );
  }

  availableItemsContent(): Children {
    return (
      <div className="MobileTabAvailableItems">
        <h2 className="MobileTabAvailableItems-header">{app.translator.trans('acpl-mobile-tab.admin.available_items')}</h2>
        <ul className="MobileTabAvailableItems-list">{listItems(this.availableItems().toArray())}</ul>
      </div>
    );
  }

  enabledItemsContent(): Children {
    return (
      <nav className="MobileTab MobileTabPreview" style={{ height: '54px', width: '320px', background: '#eee' }}>
        <ul className="MobileTab-items MobileTabPreview-items">{listItems(this.enabledItems().toArray())}</ul>
      </nav>
    );
  }

  availableItems() {
    const registeredItems = new MobileTabItemsRegistryAdmin().items();

    this.activeKeys.forEach((key: string) => {
      if (registeredItems.has(key)) registeredItems.remove(key);
    });

    return registeredItems;
  }

  enabledItems() {
    const registeredItems = new MobileTabItemsRegistryAdmin().items();
    const enabledItems = new ItemList<MobileTabRegistryItem>();

    this.activeKeys.forEach((key: string) => {
      if (registeredItems.has(key)) {
        enabledItems.add(key, registeredItems.get(key));
      }
    });

    return enabledItems;
  }

  getSortableItemKey(event: Sortable.SortableEvent) {
    const element = event.item;
    const match = Array.from(element.classList).find((className) => className.startsWith('item-'));
    if (!match) return;
    return match.replace('item-', '');
  }

  onListCreate() {
    this.sortableAvailableItems = new Sortable(this.element.querySelector('.MobileTabAvailableItems-list')!, {
      group: this.sortableKey,
      animation: 150,
      sort: false,
    });

    this.sortableEnabledItems = new Sortable(this.element.querySelector('.MobileTabPreview-items')!, {
      group: this.sortableKey,
      animation: 120,
      onAdd: (event) => {
        const key = this.getSortableItemKey(event);
        if (!key) return;
        const activeKeys = [...this.activeKeys];
        this.activeKeys = [...activeKeys, key];
        this.forcedRefreshKey++;
        m.redraw();
      },
      onSort: (event) => {
        if (event.oldIndex == null || event.newIndex == null) return;
        if (event.oldIndex === event.newIndex) return;
        if (event.from !== event.to) return;

        const current = [...this.activeKeys];

        const [moved] = current.splice(event.oldIndex, 1);
        current.splice(event.newIndex, 0, moved);

        this.activeKeys = current;
        m.redraw();
      },
      onRemove: (event) => {
        const key = this.getSortableItemKey(event);
        const activeKeys = [...this.activeKeys];
        this.activeKeys = activeKeys.filter((item) => item !== key);
        this.forcedRefreshKey++;
        m.redraw();
      },
    });
  }
}
