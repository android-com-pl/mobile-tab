import app from 'flarum/common/app';
import { Children } from 'mithril';
import MobileTabComponent from '../../common/components/MobileTabComponent';
import MobileTabItem from './MobileTabItem';

export default class ForumNotificationsTabItem extends MobileTabComponent {
  view(): Children {
    if (!app.session.user) return;
    const unread = app.session.user.unreadNotificationCount();

    const { icon, label } = this.attrs.definition;

    return (
      <MobileTabItem href={app.route('notifications')} icon={icon}>
        {unread ? <span className="Bubble">{unread}</span> : ''}
        {label}
      </MobileTabItem>
    );
  }
}
