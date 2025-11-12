import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import { Children, VnodeDOM } from 'mithril';
import Sortable from 'sortablejs';
import { MobileTabItemDefinition } from '../../common/types';
export default class MobileTabSettingsPage extends ExtensionPage {
    protected itemsSettingKey: string;
    protected sortableKey: string;
    protected sortableAvailableItems: Sortable;
    protected sortableEnabledItems: Sortable;
    /**
     * Sortablejs directly manipulates the DOM, which can confuse Mithril's diffing.
     * Changing this key forces a full re-render of the list, ensuring a clean sync.
     */
    protected forcedRefreshKey: number;
    get activeKeys(): string[];
    set activeKeys(value: string[]);
    content(vnode: VnodeDOM<ExtensionPageAttrs, this>): JSX.Element;
    availableItemsContent(): Children;
    enabledItemsContent(): Children;
    availableItems(): ItemList<MobileTabItemDefinition>;
    enabledItems(): ItemList<MobileTabItemDefinition>;
    getSortableItemKey(event: Sortable.SortableEvent): string | undefined;
    onListCreate(): void;
}
