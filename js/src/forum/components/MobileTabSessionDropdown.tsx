import app from 'flarum/forum/app';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import avatar from 'flarum/common/helpers/avatar';

export default class MobileTabSessionDropdown extends SessionDropdown {
  getButtonContent() {
    const user = app.session.user;

    // The username can be long, so it is better to display "Profile"
    return [avatar(user), ' ', <span className="Button-label">{app.translator.trans('acpl-mobile-tab.forum.profile')}</span>];
  }
}
