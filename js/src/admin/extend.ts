import Extend from 'flarum/common/extenders';
import MobileTabSettingsPage from './components/MobileTabSettingsPage';
import CustomTabItem from './models/CustomTabItem';

export default [new Extend.Admin().page(MobileTabSettingsPage), new Extend.Store().add('custom-tab-items', CustomTabItem)];
