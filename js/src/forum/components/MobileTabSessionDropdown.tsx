import app from 'flarum/forum/app';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import Avatar from 'flarum/common/components/Avatar';

export default class MobileTabSessionDropdown extends SessionDropdown {
  getButtonContent() {
    const { user } = app.session;

    return [
      <Avatar user={user} />,
      ' ',
      // The username can be long, so it is better to display "Profile"
      <span className="Button-label">{app.translator.trans('acpl-mobile-tab.forum.profile')}</span>,
    ];
  }
}
