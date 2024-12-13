import type { Children, Vnode } from 'mithril';
import app from 'flarum/forum/app';
import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import LinkButton from 'flarum/common/components/LinkButton';
import Button from 'flarum/common/components/Button';

import MobileTabSessionDropdown from './MobileTabSessionDropdown';

export default class MobileTab extends Component {
  view(vnode: Vnode<ComponentAttrs, this>): Children {
    return (
      <nav className="MobileTab">
        <ul className="MobileTab-items">{listItems(this.items().toArray())}</ul>
      </nav>
    );
  }

  items(): ItemList<Children> {
    const items = new ItemList<Children>();

    items.add(
      'home',
      <LinkButton href="/" icon="fas fa-home">
        {app.translator.trans('acpl-mobile-tab.forum.home')}
      </LinkButton>,
      100
    );

    if (app.routes.index.path === '/all') {
      items.add(
        'all',
        <LinkButton href={app.route('index')} icon="fas fa-comments">
          {app.translator.trans('acpl-mobile-tab.forum.all_discussions')}
        </LinkButton>,
        90
      );
    } else if ('askvortsov-categories' in flarum.extensions) {
      items.add(
        'categories',
        <LinkButton href={app.route('categories')} icon="fas fa-th-list">
          {app.translator.trans('acpl-mobile-tab.forum.categories')}
        </LinkButton>,
        90
      );
    } else if ('flarum-tags' in flarum.extensions) {
      items.add(
        'tags',
        <LinkButton href={app.route('tags')} icon="fas fa-tags">
          {app.translator.trans('acpl-mobile-tab.forum.tags')}
        </LinkButton>,
        90
      );
    }

    if (app.session.user) {
      const unread = app.session.user.unreadNotificationCount();
      // The default Flarum component opens as a dropdown on mobile if the drawer is not open
      items.add(
        'notifications',
        <LinkButton href={app.route('notifications')} icon="fas fa-bell" title={app.translator.trans('acpl-mobile-tab.forum.notifications')}>
          {unread ? <span className="Bubble">{unread}</span> : ''}
          {app.translator.trans('acpl-mobile-tab.forum.notifications')}
        </LinkButton>,
        80
      );

      items.add('session', <MobileTabSessionDropdown />, 70);
    } else {
      items.add(
        'logIn',
        <Button icon="fas fa-user" className="Button Button--link" onclick={() => app.modal.show(() => import('flarum/forum/components/LogInModal'))}>
          {app.translator.trans('acpl-mobile-tab.forum.log_in')}
        </Button>,
        70
      );
    }

    return items;
  }
}
