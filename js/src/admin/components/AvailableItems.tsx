import app from 'flarum/admin/app';
import { Vnode, VnodeDOM } from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import listItems from 'flarum/common/helpers/listItems';
import Sortable from 'sortablejs';
import MobileTabItemsRegistryAdmin from '../MobileTabItemsRegistryAdmin';
import Stream from 'flarum/common/utils/Stream';

interface AvailableItemsAttrs extends ComponentAttrs {
  itemsSetting: Stream<string[]>;
}

export default class AvailableItems extends Component<AvailableItemsAttrs> {
  protected sortable!: Sortable;

  oncreate(vnode: VnodeDOM<AvailableItemsAttrs, this>) {
    super.oncreate(vnode);
    this.sortable = new Sortable(this.element.querySelector('.MobileTabAvailableItems-list')!, {
      group: 'mobile-tab',
      animation: 150,
      sort: false,
    });
  }

  view(vnode: Vnode<AvailableItemsAttrs, this>) {
    return (
      <div className="MobileTabAvailableItems">
        <h2 className="MobileTabAvailableItems-header">{app.translator.trans('acpl-mobile-tab.admin.available_items')}</h2>
        <ul className="MobileTabAvailableItems-list">{listItems(this.items().toArray())}</ul>
      </div>
    );
  }

  items() {
    const registeredItems = new MobileTabItemsRegistryAdmin().items();

    this.attrs.itemsSetting().forEach((key: string) => {
      if (registeredItems.has(key)) registeredItems.remove(key);
    });

    return registeredItems;
  }
}
