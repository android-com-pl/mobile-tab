import Model from 'flarum/common/Model';

export default class MobileTabVariant extends Model {
  name = Model.attribute<string>('name');
  items = Model.attribute<string[]>('items');
  isEnabled = Model.attribute<boolean>('isEnabled');
  position = Model.attribute<number>('position');

  viewPermission() {
    return `acpl-mobile-tab.variant${this.id()}.view`;
  }
}
