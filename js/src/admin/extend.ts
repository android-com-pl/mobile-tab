import Extend from 'flarum/common/extenders';
import commonExtend from '../common/exted';
import MobileTabSettingsPage from './components/MobileTabSettingsPage';

export default [new Extend.Admin().page(MobileTabSettingsPage), ...commonExtend];
