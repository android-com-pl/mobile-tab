import MobileTabItemsRegistry from '../../common/MobileTabItemsRegistry';
/**
 * Admin-specific registry hook.
 *
 * Lets extensions modify mobile tab items only for the admin frontend.
 */
export default class MobileTabItemsRegistryAdmin extends MobileTabItemsRegistry {
    items(): import("flarum/common/utils/ItemList").default<import("../../common/types").MobileTabItemDefinition>;
}
