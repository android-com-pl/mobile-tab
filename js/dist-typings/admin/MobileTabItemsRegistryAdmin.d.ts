import MobileTabItemsRegistry from '../common/MobileTabItemsRegistry';
export default class MobileTabItemsRegistryAdmin extends MobileTabItemsRegistry {
    items(): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
}
