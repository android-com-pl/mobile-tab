import app from 'flarum/common/app';
import ItemList from 'flarum/common/utils/ItemList';
import CustomTabItem from '../admin/models/CustomTabItem';
import ForumNotificationsTabItem from '../forum/components/ForumNotificationsTabItem';
import { MobileTabItemDefinition } from './types';

export default class MobileTabItemsRegistry {
  items() {
    const itemList = new ItemList<MobileTabItemDefinition>();

    itemList.add('home', {
      icon: 'fas fa-home',
      href: () => app.route('index'),
      label: app.translator.trans('acpl-mobile-tab.lib.item.home'),
      source: 'core',
    });

    itemList.add('all_discussions', {
      icon: 'fas fa-comments',
      href: () => app.route('index'),
      label: app.translator.trans('acpl-mobile-tab.lib.item.all_discussions'),
      source: 'core',
    });

    itemList.add('notifications', {
      icon: 'fas fa-bell',
      label: app.translator.trans('acpl-mobile-tab.lib.item.notifications'),
      canView: !!app.session.user,
      forumComponent: ForumNotificationsTabItem,
      source: 'core',
    });

    itemList.add('session', {
      icon: 'fas fa-circle-user',
      label: app.translator.trans('acpl-mobile-tab.lib.item.session'),
      source: 'core',
    });

    itemList.add('search', {
      icon: 'fas fa-magnifying-glass',
      label: app.translator.trans('acpl-mobile-tab.lib.item.search'),
      source: 'core',
    });

    if ('flarum-tags' in flarum.extensions) {
      itemList.add('tags', {
        icon: 'fas fa-tags',
        href: () => app.route('tags'),
        label: app.translator.trans('acpl-mobile-tab.lib.item.tags'),
        source: 'core',
      });
    }

    if ('flarum-messages' in flarum.extensions) {
      itemList.add('messages', {
        icon: 'fas fa-envelope',
        href: () => app.route('messages'),
        label: app.translator.trans('acpl-mobile-tab.lib.item.messages'),
        canView: !!app.session.user,
        source: 'core',
      });
    }

    app.store.all<CustomTabItem>('custom-tab-items').forEach((item) => {
      itemList.add(`custom-${item.id()}`, {
        label: item.label(),
        icon: item.icon(),
        href: item.url(),
        source: 'user',
      });
    });

    return itemList;
  }
}
