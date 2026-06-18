import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import MobileTabSettingsPage from './components/MobileTabSettingsPage';

export default [new Extend.Admin().page(MobileTabSettingsPage), ...commonExtend];
