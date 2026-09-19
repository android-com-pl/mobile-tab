import app from 'flarum/admin/app';
import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import FormSection from 'flarum/admin/components/FormSection';
import FormSectionGroup from 'flarum/admin/components/FormSectionGroup';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import { Children, Vnode, VnodeDOM } from 'mithril';
import type Sortable from 'sortablejs';
import CustomTabItem from '../../common/models/CustomTabItem';
import MobileTabItemsRegistryAdmin from '../data/MobileTabItemsRegistryAdmin';
import EditCustomTabItemModal from './EditCustomTabItemModal';
import MobileTabVariant from '../../common/models/MobileTabVariant';
import MobileTabVariantSettings from './MobileTabVariantSettings';
import MobileTabItem from './MobileTabItem';

export default class MobileTabSettingsPage extends ExtensionPage {
  protected sortableAvailableItems!: Sortable;
  protected sortableVariants?: Sortable;
  /**
   * Sortablejs directly manipulates the DOM, which can confuse Mithril's diffing.
   * Changing this key forces a full re-render of the list, ensuring a clean sync.
   */
  protected forcedRefreshKey = 0;

  oninit(vnode: Vnode<ExtensionPageAttrs, this>) {
    super.oninit(vnode);

    this.loading = true;

    Promise.all([
      app.store.find<MobileTabVariant>('mobile-tab-variants'), //
      app.store.find<CustomTabItem>('custom-tab-items'),
    ]).then(() => {
      this.loading = false;
      m.redraw();
    });
  }

  content() {
    return (
      <div className="ExtensionPage-settings MobileTabSettingsPage">
        <div className="container" key={this.forcedRefreshKey}>
          <FormSectionGroup>
            {this.availableItemsContent()}
            {this.variantsContent()}
          </FormSectionGroup>
          {this.settingsContent()}
          <FormSectionGroup>{this.submitButton()}</FormSectionGroup>
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
        <p className="helpText">{app.translator.trans('acpl-mobile-tab.admin.available_items_help')}</p>
        <ul
          className="MobileTabAvailableItems-list MobileTab-items"
          oncreate={this.createAvailableItemsSortable.bind(this)}
          onremove={() => this.sortableAvailableItems?.destroy()}
        >
          {this.availableItems()
            .toArray()
            .map((item) => (
              <li className={`item-${item.itemName}`} key={item.itemName} data-id={item.itemName}>
                <MobileTabItem item={item} />
              </li>
            ))}
        </ul>
        <Button className="Button" icon="fas fa-plus" onclick={() => app.modal.show(EditCustomTabItemModal)}>
          {app.translator.trans('acpl-mobile-tab.admin.create_new_item_button')}
        </Button>
      </FormSection>
    );
  }

  variantsContent(): Children {
    return (
      <FormSection className="MobileTabVariants" label={app.translator.trans('acpl-mobile-tab.admin.variants.heading')}>
        <p className="helpText">{app.translator.trans('acpl-mobile-tab.admin.variants.help')}</p>

        <ul className="MobileTabVariants-list" oncreate={this.createVariantsSortable.bind(this)} onremove={() => this.sortableVariants?.destroy()}>
          {[...app.store.all<MobileTabVariant>('mobile-tab-variants')]
            .sort((a, b) => a.position() - b.position())
            .map((variant) => (
              <MobileTabVariantSettings key={variant.id()} variant={variant} onSortEnd={this.refreshLists.bind(this)} />
            ))}
        </ul>

        <Button className="Button MobileTabVariants-add" icon="fas fa-plus" onclick={this.createVariant.bind(this)}>
          {app.translator.trans('acpl-mobile-tab.admin.variants.create')}
        </Button>
      </FormSection>
    );
  }

  async createVariant() {
    const variant = app.store.createRecord<MobileTabVariant>('mobile-tab-variants');

    await variant.save({});

    m.redraw();
  }

  availableItems() {
    return new MobileTabItemsRegistryAdmin().items();
  }

  refreshLists() {
    this.forcedRefreshKey++;
    m.redraw();
  }

  async createAvailableItemsSortable(vnode: VnodeDOM) {
    const { default: sortableModule }: { default: typeof Sortable } = await import('flarum/admin/utils/loadSortable');

    this.sortableAvailableItems = sortableModule.create(vnode.dom as HTMLElement, {
      group: {
        name: 'mobile-tab-items',
        pull: 'clone',
        put: true,
      },
      animation: 150,
      sort: false,
      onEnd: this.refreshLists.bind(this),
    });
  }

  async createVariantsSortable(vnode: VnodeDOM) {
    const { default: sortableModule }: { default: typeof Sortable } = await import('flarum/admin/utils/loadSortable');

    this.sortableVariants = sortableModule.create(vnode.dom as HTMLElement, {
      animation: 150,
      handle: '.MobileTabVariant-handle',
      group: 'mobile-tab-variants',
      onEnd: this.refreshLists.bind(this),

      onUpdate: (event) => {
        if (event.oldIndex == null || event.newIndex == null) return;
        if (event.oldIndex === event.newIndex) return;

        const variants = [...app.store.all<MobileTabVariant>('mobile-tab-variants')].sort((a, b) => a.position() - b.position());

        const [moved] = variants.splice(event.oldIndex, 1);
        variants.splice(event.newIndex, 0, moved);

        variants.forEach((variant, position) => {
          variant.pushAttributes({ position });
        });

        void app.request({
          method: 'POST',
          url: `${app.forum.attribute('apiUrl')}/mobile-tab-variants/order`,
          body: {
            order: variants.map((variant) => variant.id()),
          },
        });

        m.redraw();
      },
    });
  }
}
