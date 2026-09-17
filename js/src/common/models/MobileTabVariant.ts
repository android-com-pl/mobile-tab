import Model from 'flarum/common/Model';

export default class MobileTabVariant extends Model {
  items = Model.attribute<string[]>('items');
  is_enabled = Model.attribute<boolean>('is_enabled');
  position = Model.attribute<number>('position');

  viewPermission(): string {
    return `acpl-mobile-tab.variant${this.id()}.view`;
  }
}
