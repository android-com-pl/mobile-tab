import app from 'flarum/admin/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import MobileTabVariant from '../../common/models/MobileTabVariant';
import MobileTabItem from './MobileTabItem';
import MobileTabItemsRegistryAdmin from '../data/MobileTabItemsRegistryAdmin';
import type Sortable from 'sortablejs';
import extractText from 'flarum/common/utils/extractText';

interface MobileTabVariantAttrs extends ComponentAttrs {
  variant: MobileTabVariant;
  onSortEnd: () => void;
}

export default class MobileTabVariantSettings extends Component<MobileTabVariantAttrs> {
  protected sortable?: Sortable;

  view(vnode: Mithril.Vnode<MobileTabVariantAttrs, this>): Mithril.Children {
    const { variant } = this.attrs;
    const items = this.enabledItems();

    return (
      <li className="MobileTabVariant" key={variant.id()} data-variant-id={variant.id()}>
        <div className="MobileTabVariant-header">
          <Button
            className="Button Button--icon Button--text MobileTabVariant-handle"
            icon="fas fa-grip-vertical"
            title={app.translator.trans('acpl-mobile-tab.admin.variants.reorder')}
          />

          <div className="MobileTabVariant-enabled">
            <Switch state={variant.is_enabled()} onchange={(is_enabled: boolean) => variant.save({ is_enabled })}>
              {app.translator.trans('acpl-mobile-tab.admin.variants.enabled')}
            </Switch>
          </div>

          <div className="MobileTabVariant-permission">
            <span className="MobileTabVariant-controlLabel">{app.translator.trans('acpl-mobile-tab.admin.variants.visible_to')}</span>
            <PermissionDropdown permission={variant.viewPermission()} allowGuest />
          </div>

          <Button
            className="Button Button--icon Button--text MobileTabVariant-delete"
            icon="fas fa-trash"
            title={app.translator.trans('acpl-mobile-tab.admin.variants.delete')}
            onclick={this.deleteVariant.bind(this)}
          />
        </div>

        <nav className="MobileTab MobileTabPreview">
          <ul
            className="MobileTab-items MobileTabPreview-items"
            data-empty-help={extractText(app.translator.trans('acpl-mobile-tab.admin.variants.empty_help'))}
            oncreate={(vnode) => this.createSortable(vnode.dom as HTMLElement)}
            onremove={() => this.sortable?.destroy()}
          >
            {items.map((item) => (
              <li className={`item-${item.itemName}`} key={`${variant.id()}-${item.itemName}`} data-id={item.itemName}>
                <MobileTabItem item={item} />
              </li>
            ))}
          </ul>
        </nav>
      </li>
    );
  }

  enabledItems() {
    const registeredItems = new MobileTabItemsRegistryAdmin().items();

    return this.attrs.variant
      .items()
      .filter((key) => registeredItems.has(key))
      .map((key) => ({
        ...registeredItems.get(key),
        itemName: key,
      }));
  }

  async createSortable(element: HTMLElement) {
    const { default: sortableModule }: { default: typeof Sortable } = await import('flarum/admin/utils/loadSortable');

    this.sortable = sortableModule.create(element, {
      group: {
        name: 'mobile-tab-items',
        put: (_to, _from, item) => !this.attrs.variant.items().includes(item.dataset.id!),
      },
      animation: 120,
      onEnd: this.attrs.onSortEnd,

      onAdd: (event) => {
        if (event.newIndex == null) return;

        const key = event.item.dataset.id;
        if (!key) return;

        const variant = this.attrs.variant;
        const items = [...variant.items()];

        if (items.includes(key)) {
          return;
        }

        const next = this.enabledItems()[event.newIndex]?.itemName;
        items.splice(next === undefined ? items.length : items.indexOf(next), 0, key);

        void variant.save({ items });
      },

      onUpdate: (event) => {
        if (event.oldIndex == null || event.newIndex == null) return;
        if (event.oldIndex === event.newIndex) return;

        const variant = this.attrs.variant;
        const key = event.item.dataset.id;
        if (!key) return;

        const items = variant.items().filter((item) => item !== key);
        const next = this.enabledItems().filter((item) => item.itemName !== key)[event.newIndex]?.itemName;
        items.splice(next === undefined ? items.length : items.indexOf(next), 0, key);

        void variant.save({ items });
      },

      onRemove: (event) => {
        const key = event.item.dataset.id;
        if (!key) return;

        const variant = this.attrs.variant;

        void variant.save({
          items: variant.items().filter((item) => item !== key),
        });
      },
    });
  }

  deleteVariant() {
    if (!confirm(extractText(app.translator.trans('acpl-mobile-tab.admin.variants.delete_confirmation')))) {
      return;
    }

    void this.attrs.variant.delete();
  }
}
