import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import Mithril, { Children, Vnode, VnodeDOM } from 'mithril';
import type Sortable from 'sortablejs';
import ItemList from 'flarum/common/utils/ItemList';
export default class MobileTabSettingsPage extends ExtensionPage {
    protected sortableAvailableItems: Sortable;
    protected sortableVariants?: Sortable;
    /**
     * Sortablejs directly manipulates the DOM, which can confuse Mithril's diffing.
     * Changing this key forces a full re-render of the list, ensuring a clean sync.
     */
    protected forcedRefreshKey: number;
    oninit(vnode: Vnode<ExtensionPageAttrs, this>): void;
    sections(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): ItemList<unknown>;
    items(): JSX.Element;
    availableItemsContent(): Children;
    variantsContent(): Children;
    createVariant(): Promise<void>;
    availableItems(): ItemList<import("../../common/types").MobileTabItemDefinition>;
    refreshLists(): void;
    createAvailableItemsSortable(vnode: VnodeDOM): Promise<void>;
    createVariantsSortable(vnode: VnodeDOM): Promise<void>;
}
