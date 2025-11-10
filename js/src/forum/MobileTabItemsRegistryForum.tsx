import Button from 'flarum/common/components/Button';
import app from 'flarum/forum/app';
import MobileTabItemsRegistry from '../common/MobileTabItemsRegistry';
import MobileTabSessionDropdown from './components/MobileTabSessionDropdown';

export default class MobileTabItemsRegistryForum extends MobileTabItemsRegistry {
  items() {
    const items = super.items();

    if (app.session.user) {
      items.add('session', <MobileTabSessionDropdown />);
    } else {
      items.add(
        'session',
        <Button icon="fas fa-user" className="Button Button--link" onclick={() => app.modal.show(() => import('flarum/forum/components/LogInModal'))}>
          {app.translator.trans('acpl-mobile-tab.lib.item.log_in')}
        </Button>
      );
    }

    return items;
  }
}
