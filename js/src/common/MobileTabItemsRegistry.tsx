import app from 'flarum/common/app';
import ItemList from 'flarum/common/utils/ItemList';
import MobileTabItem from './components/MobileTabItem';
import { MobileTabRegistryItem } from './types';

export default class MobileTabItemsRegistry {
  items() {
    const itemList = new ItemList<MobileTabRegistryItem>();

    itemList.add(
      'home',
      <MobileTabItem href={app.routes?.index?.path ?? '/'} icon="fas fa-home">
        {app.translator.trans('acpl-mobile-tab.lib.item.home')}
      </MobileTabItem>
    );

    itemList.add(
      'all_discussions',
      <MobileTabItem href={app.routes?.index?.path ?? '/all'} icon="fas fa-comments">
        {app.translator.trans('acpl-mobile-tab.lib.item.all_discussions')}
      </MobileTabItem>
    );

    if (app.session.user) {
      const unread = app.session.user.unreadNotificationCount();
      itemList.add(
        'notifications',
        <MobileTabItem href={app.routes?.notifications?.path ?? '/notifications'} icon="fas fa-bell">
          {unread ? <span className="Bubble">{unread}</span> : ''}
          {app.translator.trans('acpl-mobile-tab.lib.item.notifications')}
        </MobileTabItem>
      );
    }

    if ('flarum-tags' in flarum.extensions) {
      itemList.add(
        'tags',
        <MobileTabItem href={app.routes?.tags?.path ?? '/tags'} icon="fas fa-tags">
          {app.translator.trans('acpl-mobile-tab.lib.item.tags')}
        </MobileTabItem>
      );
    }

    return itemList;
  }
}
