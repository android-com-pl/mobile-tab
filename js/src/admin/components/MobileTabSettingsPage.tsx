import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import FormSection from 'flarum/admin/components/FormSection';
import FormSectionGroup from 'flarum/admin/components/FormSectionGroup';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import { Children, Vnode, VnodeDOM } from 'mithril';
import type Sortable from 'sortablejs';
import CustomTabItem from '../../common/models/CustomTabItem';
import MobileTabVariant from '../../common/models/MobileTabVariant';
import { MobileTabItemDefinition } from '../../common/types';
import MobileTabItemsRegistryAdmin from '../data/MobileTabItemsRegistryAdmin';
import EditCustomTabItemModal from './EditCustomTabItemModal';
import MobileTabVariantBox from './MobileTabVariantBox';

export default class MobileTabSettingsPage extends ExtensionPage {
  protected variants: MobileTabVariant[] = [];
  protected busy = false;
  protected paletteKey = 0;
  protected sortableAvailableItems?: Sortable;
  protected sortableVariants?: Sortable;
  protected sortableModule?: typeof Sortable;
  protected loadFailed = false;

  oninit(vnode: Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);
    void this.load();
  }

  async load() {
    this.loading = true;
    this.loadFailed = false;
    try {
      const [variants, , { default: sortableModule }] = await Promise.all([
        app.store.find<MobileTabVariant[]>('mobile-tab-variants'),
        this.loadCustomItems(),
        import('flarum/admin/utils/loadSortable'),
      ]);
      this.variants = variants;
      this.sortableModule = sortableModule;
    } catch {
      this.loadFailed = true;
    } finally {
      this.loading = false;
      m.redraw();
    }
  }

  async loadCustomItems() {
    let offset = 0;
    let more = true;
    while (more) {
      const page = await app.store.find<CustomTabItem[]>('custom-tab-items', { page: { offset, limit: 50 } });
      offset += page.length;
      more = !!page.payload.links?.next;
    }
  }

  sections(vnode: VnodeDOM<ExtensionPageAttrs, this>) {
    const sections = super.sections(vnode);
    if (!app.registry.extensionHasPermissions(this.extension.id)) sections.remove('permissions');
    return sections;
  }

  content() {
    if (this.loading) return <LoadingIndicator />;
    if (this.loadFailed)
      return (
        <Button className="Button" onclick={() => this.load()}>
          {this.trans('retry')}
        </Button>
      );

    return (
      <div className="ExtensionPage-settings MobileTabSettingsPage">
        <div className="container">
          <p className="helpText">{this.trans('help')}</p>
          <p className="helpText">{this.trans('permissions_help')}</p>
          <p className="helpText">{this.trans('autosave')}</p>
          <div className="MobileTabSettingsPage-layout">
            {this.availableItemsContent()}
            <section className="MobileTabVariants" aria-label={extractText(this.trans('title'))}>
              <h3>{this.trans('title')}</h3>
              <div
                className="MobileTabVariants-list"
                oncreate={(vnode: VnodeDOM) => this.createVariantsSortable(vnode.dom as HTMLElement)}
                onremove={() => this.sortableVariants?.destroy()}
              >
                {this.variants.map((variant, index) => (
                  <MobileTabVariantBox
                    key={variant.id()}
                    model={variant}
                    sortableModule={this.sortableModule!}
                    disabled={this.busy}
                    first={index === 0}
                    last={index === this.variants.length - 1}
                    itemContent={this.itemContent.bind(this)}
                    onPaletteDrop={() => this.paletteKey++}
                    onduplicate={() => this.createVariant(variant)}
                    ondelete={() => this.deleteVariant(variant)}
                    onmove={(delta: number) => this.moveVariant(index, index + delta)}
                  />
                ))}
              </div>
              {!this.variants.length && <p className="helpText">{this.trans('empty')}</p>}
              <Button className="Button Button--primary" icon="fas fa-plus" disabled={this.busy} onclick={() => this.createVariant()}>
                {this.trans('add')}
              </Button>
            </section>
          </div>
          <FormSectionGroup>
            <FormSection label={this.trans('behavior')}>
              {this.settingsContent()}
              {this.submitButton()}
            </FormSection>
          </FormSectionGroup>
        </div>
      </div>
    );
  }

  settingsContent(): Children {
    return (
      <Form>
        {this.buildSettingComponent({
          type: 'boolean',
          setting: 'acpl-mobile-tab.hide_on_scroll',
          label: app.translator.trans('acpl-mobile-tab.admin.scroll_settings.toggle_label'),
        })}
        {this.buildSettingComponent({
          type: 'number',
          setting: 'acpl-mobile-tab.scroll_threshold',
          label: app.translator.trans('acpl-mobile-tab.admin.scroll_settings.threshold_label'),
          help: app.translator.trans('acpl-mobile-tab.admin.scroll_settings.threshold_help'),
        })}
      </Form>
    );
  }

  availableItemsContent(): Children {
    return (
      <FormSection className="MobileTabAvailableItems" label={app.translator.trans('acpl-mobile-tab.admin.available_items')}>
        <p className="helpText">{this.trans('palette_help')}</p>
        <div>
          <ul
            className="MobileTabAvailableItems-list MobileTab-items"
            key={this.paletteKey}
            oncreate={(vnode: VnodeDOM) => {
              this.sortableAvailableItems = this.sortableModule!.create(vnode.dom as HTMLElement, {
                group: { name: 'acpl-mobile-tab-items', pull: 'clone', put: false },
                animation: 150,
                sort: false,
              });
            }}
            onbeforeremove={() => this.sortableAvailableItems?.destroy()}
          >
            {this.availableItems()
              .toArray()
              .map((item) => (
                <li className={`item-${item.itemName}`} data-item-key={item.itemName} key={item.itemName}>
                  {this.itemContent(item)}
                </li>
              ))}
          </ul>
        </div>
        <Button className="Button" icon="fas fa-plus" onclick={() => app.modal.show(EditCustomTabItemModal)}>
          {app.translator.trans('acpl-mobile-tab.admin.create_new_item_button')}
        </Button>
        <p className="helpText">{this.trans('shared_items_help')}</p>
      </FormSection>
    );
  }

  itemContent(item: ReturnType<ItemList<MobileTabItemDefinition>['toArray']>[number]): Children {
    return (
      <Button
        className={classList('Button', { 'Button--dashed': item.source !== 'user' }, 'MobileTab-item', {
          'MobileTab-item--editable': item.source === 'user',
        })}
        icon={item.icon}
        onclick={() => {
          if (item.source === 'user') {
            const id = item.itemName.match(/(\d+)$/);
            if (id) app.modal.show(EditCustomTabItemModal, { model: app.store.getById('custom-tab-items', id[0]) });
          }
        }}
      >
        {item.label}
      </Button>
    );
  }

  availableItems() {
    return new MobileTabItemsRegistryAdmin().items();
  }

  createVariantsSortable(element: HTMLElement) {
    this.sortableVariants = this.sortableModule!.create(element, {
      animation: 150,
      handle: '.MobileTabVariantBox-handle',
      draggable: '.MobileTabVariantBox',
      onEnd: (event) => {
        if (event.oldIndex == null || event.newIndex == null || event.oldIndex === event.newIndex) return;
        // Restore Mithril's DOM before changing the keyed model list.
        event.item.remove();
        event.from.insertBefore(event.item, event.from.children[event.oldIndex] ?? null);
        void this.moveVariant(event.oldIndex, event.newIndex);
      },
    });
  }

  async moveVariant(from: number, to: number) {
    if (this.busy || to < 0 || to >= this.variants.length) return;
    const previous = [...this.variants];
    const next = [...previous];
    next.splice(to, 0, next.splice(from, 1)[0]);
    this.variants = next;
    this.busy = true;
    this.sortableVariants?.option('disabled', true);
    m.redraw();
    try {
      await app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/mobile-tab-variants/order',
        body: { order: next.map((v) => v.id()) },
      });
      next.forEach((variant, position) => variant.pushAttributes({ position }));
    } catch {
      this.variants = previous;
    } finally {
      this.busy = false;
      this.sortableVariants?.option('disabled', false);
      m.redraw();
    }
  }

  async createVariant(source?: MobileTabVariant) {
    this.busy = true;
    try {
      const variant = await app.store.createRecord<MobileTabVariant>('mobile-tab-variants').save({
        name: extractText(source ? this.trans('copy_name', { name: source.name() }) : this.trans('new_name')),
        items: source ? [...source.items()] : [],
        isEnabled: false,
      });
      this.variants.push(variant);
    } catch {
      // Flarum displays the API error; keep the existing boxes available.
    } finally {
      this.busy = false;
      m.redraw();
    }
  }

  async deleteVariant(variant: MobileTabVariant) {
    if (!confirm(extractText(this.trans('delete_confirmation', { name: variant.name() })))) return;
    this.busy = true;
    try {
      await variant.delete();
      this.variants = this.variants.filter((item) => item !== variant);
    } catch {
      // Keep the box when deletion fails.
    } finally {
      this.busy = false;
      m.redraw();
    }
  }

  trans(key: string, parameters = {}) {
    return app.translator.trans(`acpl-mobile-tab.admin.variants.${key}`, parameters);
  }
}
