import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import MobileTabSettingsPage from './components/MobileTabSettingsPage';
import MobileTabVariant from '../common/models/MobileTabVariant';

export default [new Extend.Admin().page(MobileTabSettingsPage), new Extend.Store().add('mobile-tab-variants', MobileTabVariant), ...commonExtend];
