import app from 'flarum/common/app';
import { Children } from 'mithril';
import MobileTabComponent from '../../common/components/MobileTabComponent';
import MobileTabItem from './MobileTabItem';

export default class ForumNotificationsTabItem extends MobileTabComponent {
  view(): Children {
    if (!app.session.user) return;
    const unread = this.getUnreadCount();

    const { icon, label, href } = this.attrs.definition;

    return (
      <MobileTabItem href={typeof href === 'function' ? href() : href} icon={icon}>
        {unread ? <span className="Bubble">{unread}</span> : ''}
        {label}
      </MobileTabItem>
    );
  }

  getUnreadCount(): number | null {
    return app.session.user!.unreadNotificationCount() || null;
  }
}
