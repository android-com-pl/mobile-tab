import Extend from 'flarum/common/extenders';
import CustomTabItem from './models/CustomTabItem';

export default [new Extend.Store().add('custom-tab-items', CustomTabItem)];
