import { components } from '@acpl/mobile-tab';
import { extend } from 'flarum/common/extend';

const { MobileTab, MobileTabItem } = components;

export default () => {
  extend(MobileTab.prototype, 'items', (items) => {
    // Add new item
    items.add('following', <MobileTabItem href={app.route('following')} icon="fas fa-star" />, 90);

    // Add new item using custom HTML
    items.add('my-item', <div>...This is my custom item</div>, 70);

    // Remove item
    items.remove('home');
  });
};
