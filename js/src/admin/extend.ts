import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import MobileTabSettingsPage from './components/MobileTabSettingsPage';
import MobileTabVariant from '../common/models/MobileTabVariant';

export default [
  ...commonExtend, //
  new Extend.Store().add('mobile-tab-variants', MobileTabVariant),
  new Extend.Admin()
    .page(MobileTabSettingsPage)
    .setting(() => ({
      type: 'boolean',
      setting: 'acpl-mobile-tab.hide_on_scroll',
      label: app.translator.trans('acpl-mobile-tab.admin.scroll_settings.toggle_label'),
    }))
    .setting(() => ({
      type: 'number',
      setting: 'acpl-mobile-tab.scroll_threshold',
      label: app.translator.trans('acpl-mobile-tab.admin.scroll_settings.threshold_label'),
      help: app.translator.trans('acpl-mobile-tab.admin.scroll_settings.threshold_help'),
    })),
];
