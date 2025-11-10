import app from 'flarum/admin/app';
import MobileTabItemsRegistry from '../common/MobileTabItemsRegistry';
import MobileTabItem from '../common/components/MobileTabItem';

export default class MobileTabItemsRegistryAdmin extends MobileTabItemsRegistry {
  items() {
    const items = super.items();

    items.add('session', <MobileTabItem icon="fas fa-circle-user">{app.translator.trans('acpl-mobile-tab.admin.item.session')}</MobileTabItem>);

    return items;
  }
}
