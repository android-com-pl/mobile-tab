import app from 'flarum/common/app';
import ItemList from 'flarum/common/utils/ItemList';
import CustomTabItem from '../common/models/CustomTabItem';
import { MobileTabItemDefinition } from './types';

export default class MobileTabItemsRegistry {
  items() {
    const itemList = new ItemList<MobileTabItemDefinition>();

    itemList.add('home', {
      icon: 'fas fa-home',
      href: '/',
      label: app.translator.trans('acpl-mobile-tab.lib.item.home'),
      source: 'core',
    });

    itemList.add('all_discussions', {
      icon: 'fas fa-comments',
      href: () => app.route('index'),
      label: app.translator.trans('acpl-mobile-tab.lib.item.all_discussions'),
      source: 'core',
    });

    itemList.add('new_discussion', {
      icon: 'fas fa-edit',
      label: app.translator.trans('acpl-mobile-tab.lib.item.new_discussion'),
      canView: !!(app.session.user && app.forum.attribute<boolean>('canStartDiscussion')),
      source: 'core',
    });

    itemList.add('notifications', {
      icon: 'fas fa-bell',
      href: () => app.route('notifications'),
      label: app.translator.trans('acpl-mobile-tab.lib.item.notifications'),
      canView: !!app.session.user,
      counter: () => app.session.user!.unreadNotificationCount() || null,
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

    if ('flarum-flags' in flarum.extensions) {
      itemList.add('flags', {
        icon: 'fas fa-flag',
        href: () => app.route('flags'),
        label: app.translator.trans('acpl-mobile-tab.lib.item.flags'),
        canView: !!app.session.user && app.forum.attribute<boolean>('canViewFlags'),
        counter: () => app.forum.attribute<number>('flagCount'),
        source: 'core',
      });
    }

    if ('fof-byobu' in flarum.extensions) {
      itemList.add('fof-byobu', {
        icon: app.forum.attribute('byobu.icon-badge') || 'fas fa-map',
        href: () => app.route('byobuPrivate'),
        label: app.translator.trans('acpl-mobile-tab.lib.item.fof-byobu'),
        canView: !!app.session.user,
        source: 'core',
      });
    }

    if ('ramon-chat' in flarum.extensions) {
      itemList.add('ramon-chat', {
        icon: app.forum.attribute<string>('ramon-chat.icon') || 'fas fa-comments',
        href: () => app.route('chat.index'),
        label: app.forum.attribute<string>('ramon-chat.title') || app.translator.trans('acpl-mobile-tab.lib.item.ramon-chat'),
        canView: !!app.session.user && app.forum.attribute<boolean>('canUseChat'),
        source: 'core',
      });
    }

    app.store.all<CustomTabItem>('custom-tab-items').forEach((item) => {
      itemList.add(`custom-${item.id()}`, {
        label: item.label(),
        icon: item.icon(),
        href: item.url(),
        isNewTab: item.isNewTab(),
        isInternal: item.isInternal(),
        source: 'user',
      });
    });

    return itemList;
  }
}
