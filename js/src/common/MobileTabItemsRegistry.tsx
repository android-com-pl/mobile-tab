import app from 'flarum/common/app';
import ItemList from 'flarum/common/utils/ItemList';
import MobileTabItem from './components/MobileTabItem';
import { MobileTabRegistryItem } from './types';

export default class MobileTabItemsRegistry {
  items() {
    const itemList = new ItemList<MobileTabRegistryItem>();

    itemList.add(
      'home',
      <MobileTabItem href="/" icon="fas fa-home">
        {app.translator.trans('acpl-mobile-tab.lib.item.home')}
      </MobileTabItem>
    );
    itemList.add(
      'all_discussions',
      <MobileTabItem href="/all" icon="fas fa-comments">
        {app.translator.trans('acpl-mobile-tab.lib.item.all_discussions')}
      </MobileTabItem>
    );

    return itemList;
  }
}
