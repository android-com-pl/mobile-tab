import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import FormSection from 'flarum/admin/components/FormSection';
import FormSectionGroup from 'flarum/admin/components/FormSectionGroup';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import { Children, Vnode } from 'mithril';
import Sortable from 'sortablejs';
import { MobileTabItemDefinition } from '../../common/types';
import MobileTabItemsRegistryAdmin from '../MobileTabItemsRegistryAdmin';
import CustomTabItem from '../models/CustomTabItem';
import EditCustomTabItemModal from './EditCustomTabItemModal';

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

  oninit(vnode: Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    this.loading = true;
    app.store.find<CustomTabItem>('custom-tab-items').then(() => {
      this.loading = false;
      m.redraw();
    });
  }

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

  content() {
    return (
      <div className="ExtensionPage-settings">
        <div className="container" key={this.forcedRefreshKey} oncreate={this.onListCreate.bind(this)}>
          <FormSectionGroup>
            {this.availableItemsContent()}
            {this.enabledItemsContent()}
          </FormSectionGroup>
          <FormSectionGroup>{this.submitButton()}</FormSectionGroup>
        </div>
      </div>
    );
  }

  availableItemsContent(): Children {
    return (
      <FormSection className="MobileTabAvailableItems" label={app.translator.trans('acpl-mobile-tab.admin.available_items')}>
        <ul className="MobileTabAvailableItems-list MobileTab-items">
          {this.availableItems()
            .toArray()
            .map((item) => (
              <li className={`item-${item.itemName}`} key={item.itemName}>
                {this.itemContent(item)}
              </li>
            ))}
        </ul>
        <Button className="Button" icon="fas fa-plus" onclick={() => app.modal.show(EditCustomTabItemModal)}>
          {app.translator.trans('acpl-mobile-tab.admin.create_new_item_button')}
        </Button>
      </FormSection>
    );
  }

  enabledItemsContent(): Children {
    return (
      <FormSection label={app.translator.trans('acpl-mobile-tab.admin.active_items')}>
        <nav className="MobileTab MobileTabPreview">
          <ul className="MobileTab-items MobileTabPreview-items">
            {this.enabledItems()
              .toArray()
              .map((item) => (
                <li className={`item-${item.itemName}`} key={item.itemName}>
                  {this.itemContent(item)}
                </li>
              ))}
          </ul>
        </nav>
      </FormSection>
    );
  }

  itemContent(item: ReturnType<ItemList<MobileTabItemDefinition>['toArray']>[number]): Children {
    return (
      <Button
        className="Button MobileTab-item"
        icon={item.icon}
        onclick={() => {
          if (item.source === 'user') {
            const id = item.itemName.match(/(\d+)$/);
            if (!id) return;
            app.modal.show(EditCustomTabItemModal, { model: app.store.getById('custom-tab-items', id[0]) });
          }
        }}
      >
        {item.label}
      </Button>
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
    const enabledItems = new ItemList<MobileTabItemDefinition>();

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
        if (event.newIndex == null) return;

        const key = this.getSortableItemKey(event);
        if (!key) return;

        const activeKeys = [...this.activeKeys];
        activeKeys.splice(event.newIndex, 0, key);

        this.activeKeys = activeKeys;
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
