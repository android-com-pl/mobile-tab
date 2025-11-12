import ItemList from 'flarum/common/utils/ItemList';
import { MobileTabItemDefinition } from './types';
export default class MobileTabItemsRegistry {
    items(): ItemList<MobileTabItemDefinition>;
}
