import Model from 'flarum/common/Model';

export default class CustomTabItem extends Model {
  label = Model.attribute<string>('label');
  url = Model.attribute<string>('url');
  icon = Model.attribute<string>('icon');
  isNewTab = Model.attribute<boolean>('isNewTab');
  isInternal = Model.attribute<boolean>('isInternal');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
}
