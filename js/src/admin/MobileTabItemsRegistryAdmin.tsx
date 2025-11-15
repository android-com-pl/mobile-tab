import app from 'flarum/admin/app';
import MobileTabItemsRegistry from '../common/MobileTabItemsRegistry';
import CustomTabItem from './models/CustomTabItem';

export default class MobileTabItemsRegistryAdmin extends MobileTabItemsRegistry {
  items() {
    const items = super.items();

    app.store.all<CustomTabItem>('custom-tab-items').forEach((item) => {
      items.add(`custom-${item.id()}`, {
        label: item.label(),
        icon: item.icon(),
        href: item.url(),
        source: 'user',
      });
    });

    return items;
  }
}
