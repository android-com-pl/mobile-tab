import app from 'flarum/admin/app';
import PermissionDropdown from 'flarum/admin/components/PermissionDropdown';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import Icon from 'flarum/common/components/Icon';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import type { Children, Vnode, VnodeDOM } from 'mithril';
import type Sortable from 'sortablejs';
import MobileTabVariant from '../../common/models/MobileTabVariant';
import { MobileTabItemDefinition } from '../../common/types';
import MobileTabItemsRegistryAdmin from '../data/MobileTabItemsRegistryAdmin';

interface VariantBoxAttrs extends ComponentAttrs {
  model: MobileTabVariant;
  sortableModule: typeof Sortable;
  disabled: boolean;
  first: boolean;
  last: boolean;
  itemContent: (item: ReturnType<ItemList<MobileTabItemDefinition>['toArray']>[number]) => Children;
  onPaletteDrop: () => void;
  onduplicate: () => void;
  ondelete: () => void;
  onmove: (delta: number) => void;
}

export default class MobileTabVariantBox extends Component<VariantBoxAttrs> {
  protected name = '';
  protected saving = false;
  protected listKey = 0;
  protected sortable?: Sortable;
  protected selectedItem = '';

  oninit(vnode: Vnode<VariantBoxAttrs, this>) {
    super.oninit(vnode);
    this.name = this.attrs.model.name();
  }

  view() {
    const model = this.attrs.model;
    const disabled = this.attrs.disabled || this.saving;
    const registered = new MobileTabItemsRegistryAdmin().items();
    const keys = model.items() ?? [];
    const available = registered.toArray().filter((item) => !keys.includes(item.itemName));

    return (
      <article className={`MobileTabVariantBox${model.isEnabled() ? '' : ' MobileTabVariantBox--disabled'}`}>
        <div className="MobileTabVariantBox-header">
          <span className="MobileTabVariantBox-handle" title={extractText(this.trans('reorder'))} aria-hidden="true">
            <Icon name="fas fa-grip-vertical" />
          </span>
          <input
            className="FormControl MobileTabVariantBox-name"
            aria-label={extractText(this.trans('name'))}
            value={this.name}
            maxlength={255}
            disabled={disabled}
            oninput={(event: InputEvent) => (this.name = (event.target as HTMLInputElement).value)}
            onblur={() => this.saveName()}
            onkeydown={(event: KeyboardEvent) => {
              if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
            }}
          />
          <div className="MobileTabVariantBox-permissions">
            <span>{this.trans('access')}</span>
            <PermissionDropdown permission={model.viewPermission()} allowGuest={true} />
          </div>
          <Switch state={model.isEnabled()} disabled={disabled} loading={this.saving} onchange={(isEnabled: boolean) => this.save({ isEnabled })}>
            {this.trans('enabled')}
          </Switch>
        </div>
        <nav className="MobileTab MobileTabPreview" aria-label={model.name()}>
          <ul
            className="MobileTab-items MobileTabPreview-items"
            key={this.listKey}
            oncreate={(vnode: VnodeDOM) => this.createSortable(vnode.dom as HTMLElement)}
            onbeforeremove={() => this.sortable?.destroy()}
          >
            {keys.map((key, index) => (
              <li key={key} data-item-key={key} className={`item-${key}`}>
                {registered.has(key) ? (
                  this.attrs.itemContent({ ...registered.get(key), itemName: key })
                ) : (
                  <span className="MobileTabVariantBox-missing">{this.trans('unavailable', { key })}</span>
                )}
                <div className="MobileTabVariantBox-itemActions">
                  <Button
                    className="Button Button--text Button--icon"
                    icon="fas fa-angle-left"
                    aria-label={extractText(this.trans('item_left'))}
                    disabled={disabled || index === 0}
                    onclick={() => this.moveItem(index, index - 1)}
                  />
                  <Button
                    className="Button Button--text Button--icon"
                    icon="fas fa-times"
                    aria-label={extractText(this.trans('remove_item'))}
                    disabled={disabled}
                    onclick={() => this.save({ items: keys.filter((item) => item !== key) })}
                  />
                  <Button
                    className="Button Button--text Button--icon"
                    icon="fas fa-angle-right"
                    aria-label={extractText(this.trans('item_right'))}
                    disabled={disabled || index === keys.length - 1}
                    onclick={() => this.moveItem(index, index + 1)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </nav>
        {!keys.length && <p className="helpText">{this.trans('drop_here')}</p>}
        <div className="MobileTabVariantBox-footer">
          <select
            className="FormControl"
            aria-label={extractText(this.trans('add_item'))}
            value={this.selectedItem}
            disabled={disabled}
            onchange={(event: Event) => (this.selectedItem = (event.target as HTMLSelectElement).value)}
          >
            <option value="">{this.trans('choose_item')}</option>
            {available.map((item) => (
              <option value={item.itemName}>{item.label}</option>
            ))}
          </select>
          <Button
            className="Button"
            icon="fas fa-plus"
            disabled={disabled || !available.some((item) => item.itemName === this.selectedItem)}
            onclick={() => {
              if (!this.selectedItem || keys.includes(this.selectedItem)) return;
              void this.save({ items: [...keys, this.selectedItem] });
              this.selectedItem = '';
            }}
          >
            {this.trans('add_item')}
          </Button>
          <div className="MobileTabVariantBox-actions">
            <Button
              className="Button Button--text Button--icon"
              icon="fas fa-arrow-up"
              aria-label={extractText(this.trans('move_up'))}
              disabled={disabled || this.attrs.first}
              onclick={() => this.attrs.onmove(-1)}
            />
            <Button
              className="Button Button--text Button--icon"
              icon="fas fa-arrow-down"
              aria-label={extractText(this.trans('move_down'))}
              disabled={disabled || this.attrs.last}
              onclick={() => this.attrs.onmove(1)}
            />
            <Button className="Button Button--text" icon="fas fa-copy" disabled={disabled} onclick={this.attrs.onduplicate}>
              {this.trans('duplicate')}
            </Button>
            <Button className="Button Button--text" icon="fas fa-trash" disabled={disabled} onclick={this.attrs.ondelete}>
              {this.trans('delete')}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  onupdate() {
    this.sortable?.option('disabled', this.saving || this.attrs.disabled);
  }

  createSortable(element: HTMLElement) {
    this.sortable = this.attrs.sortableModule.create(element, {
      group: {
        name: 'acpl-mobile-tab-items',
        pull: false,
        put: (_to, _from, item) =>
          !this.saving && !this.attrs.disabled && !!item.dataset.itemKey && !this.attrs.model.items().includes(item.dataset.itemKey),
      },
      animation: 150,
      draggable: 'li',
      filter: '.MobileTabVariantBox-itemActions',
      preventOnFilter: false,
      disabled: this.saving || this.attrs.disabled,
      onAdd: (event) => {
        const key = event.item.dataset.itemKey;
        event.item.remove();
        this.attrs.onPaletteDrop();
        this.listKey++;
        const items = [...this.attrs.model.items()];
        if (key && !items.includes(key)) {
          items.splice(event.newDraggableIndex ?? items.length, 0, key);
          void this.save({ items });
        }
        m.redraw();
      },
      onEnd: (event) => {
        if (event.oldIndex == null || event.newIndex == null || event.oldIndex === event.newIndex) return;
        event.item.remove();
        event.from.insertBefore(event.item, event.from.children[event.oldIndex] ?? null);
        this.moveItem(event.oldIndex, event.newIndex);
      },
    });
  }

  moveItem(from: number, to: number) {
    const items = [...this.attrs.model.items()];
    items.splice(to, 0, items.splice(from, 1)[0]);
    void this.save({ items });
  }

  async saveName() {
    const name = this.name.trim();
    if (!name) {
      this.name = this.attrs.model.name();
      return;
    }
    if (name !== this.attrs.model.name()) await this.save({ name });
  }

  async save(attributes: { name?: string; items?: string[]; isEnabled?: boolean }) {
    if (this.saving || this.attrs.disabled) return;
    this.saving = true;
    try {
      await this.attrs.model.save(attributes);
    } catch {
      // Model.save restores the previous attributes and Flarum shows the error.
    } finally {
      this.name = this.attrs.model.name();
      this.saving = false;
      m.redraw();
    }
  }

  trans(key: string, parameters = {}) {
    return app.translator.trans(`acpl-mobile-tab.admin.variants.${key}`, parameters);
  }
}
