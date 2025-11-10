import Component, { ComponentAttrs } from 'flarum/common/Component';
import { Vnode, VnodeDOM } from 'mithril';
import Sortable from 'sortablejs';
import MobileTabItemsRegistryAdmin from '../MobileTabItemsRegistryAdmin';
import listItems from 'flarum/common/helpers/listItems';
import Stream from 'flarum/common/utils/Stream';
import ItemList from 'flarum/common/utils/ItemList';
import { MobileTabRegistryItem } from '../../common/types';

interface MobilTabPreviewAttrs extends ComponentAttrs {
  itemsSetting: Stream<string[]>;
}

export default class MobileTabPreview extends Component<MobilTabPreviewAttrs> {
  protected sortable!: Sortable;

  oncreate(vnode: VnodeDOM<MobilTabPreviewAttrs, this>) {
    super.oncreate(vnode);
    this.sortable = new Sortable(this.element.querySelector('.MobileTabPreview-items')!, {
      group: 'mobile-tab',
      animation: 120,
      onAdd: this.handleAdd.bind(this),
    });
  }

  view(vnode: Vnode<MobilTabPreviewAttrs, this>) {
    return (
      <nav className="MobileTab MobileTabPreview" style={{ height: '54px', width: '320px', background: '#eee' }}>
        <ul className="MobileTab-items MobileTabPreview-items">{listItems(this.items().toArray())}</ul>
      </nav>
    );
  }

  items() {
    const registeredItems = new MobileTabItemsRegistryAdmin().items();
    const enabledItems = new ItemList<MobileTabRegistryItem>();

    this.attrs.itemsSetting().forEach((key: string) => {
      const item = registeredItems.get(key);
      if (item) enabledItems.add(key, item);
    });

    return enabledItems;
  }

  handleAdd(event: Sortable.SortableEvent) {
    const element = event.item;
    const match = Array.from(element.classList).find((className) => className.startsWith('item-'));
    if (!match) return;
    const key = match.replace('item-', '');

    // TODO
  }
}
